import type { Request, RequestHandler, Response } from 'express';

import { puzzleMapFromList } from 'src/server/puzzles';
import { bail400, error200 } from './util';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { ClientPuzzle, puzzleToClientPuzzle } from 'src/types/Puzzle';
import PuzzleInstance from 'src/lib/db/PuzzleInstance';
import {
  ClientPuzzleInstance,
  puzzleInstanceToClientPuzzleInstance,
} from 'src/types/ClientPuzzleInstance';
import PuzzleInstanceUser from 'src/lib/db/PuzzleInstanceUser';
import User from 'src/lib/db/User';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';

export const listPuzzles: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const slugToPuzzle = puzzleMapFromList();
    const slugToClientPuzzle: { [slug: string]: ClientPuzzle } = {};
    for (const key in slugToPuzzle) {
      slugToClientPuzzle[key] = puzzleToClientPuzzle(slugToPuzzle[key]);
    }

    let instances: PuzzleInstance[];
    if (req.context?.team) {
      instances = await PuzzleInstance.findAll({
        where: { teamId: req.context?.team.id },
      });
    } else if (req.context?.user) {
      instances = await PuzzleInstance.findAll({
        where: { userId: req.context?.user.id },
      });
    } else {
      bail400('No user or team, no puzzles. Capiche?', res);
      return;
    }

    const solvedMap: { [puzzleName: string]: boolean } = {};
    for (const instance of instances) {
      solvedMap[instance.puzzleId] = !!instance.solvedAt;
    }

    res.status(200);
    res.send(
      JSON.stringify({ success: true, puzzles: slugToClientPuzzle, solvedMap }),
    );
  } catch (e) {
    console.log('Failed to fetch puzzle list: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};

export const getPuzzleInfo: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.context) {
      throw new Error('Everything is ruined');
    }

    if (!req.context.user) {
      throw new Error('Cannot get puzzle info with no user');
    }

    if (
      req.body &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object'
    ) {
      if (
        hasOwnProperty(req.body.data, 'slug') &&
        typeof req.body.data.slug === 'string'
      ) {
        const { slug } = req.body.data;
        const pmap = puzzleMapFromList();
        if (pmap[slug]) {
          let instance: ClientPuzzleInstance | null = null;
          let pi: PuzzleInstance | null = null;
          if (req.context?.team) {
            pi = await PuzzleInstance.findOne({
              where: {
                teamId: req.context.team.id,
                puzzleId: slug,
              },
            });
          } else if (req.context?.user) {
            pi = await PuzzleInstance.findOne({
              where: {
                userId: req.context.user.id,
                puzzleId: slug,
              },
            });
          }

          if (pi) {
            const instanceMembers = await PuzzleInstanceUser.findAll({
              where: {
                puzzleInstanceId: pi.id,
              },
            });

            let teamMembers = [req.context.user];
            if (req.context.team) {
              teamMembers = await User.findAll({
                where: {
                  teamId: req.context?.team.id,
                },
              });
            }

            // I'm being pretty lazy about cleaning up puzzle instances when
            // teams change. Puzzle instances can be tightly coupled to the
            // numbers of members of a team as well as to the specific members
            // of the team. So, if a team changes out its members, that's bad
            // news for any existing puzzle instances.  To combat this, we'll do
            // these checks to make sure the team hasn't changed its
            // composition. If it has, we nuke the instance and start again.
            let deleteTheInstance = false;
            const everyoneIsDead =
              instanceMembers.length === 0 || teamMembers.length === 0;
            const membersListsAreDifferentInLength =
              instanceMembers.length !== teamMembers.length;
            if (everyoneIsDead || membersListsAreDifferentInLength) {
              deleteTheInstance = true;
            } else {
              const puzzleInstanceUserIds = instanceMembers
                .map((im) => im.userId)
                .sort();

              const teamUserIds = teamMembers.map((tm) => tm.id).sort();
              for (let i = 0; i < teamUserIds.length; i++) {
                if (puzzleInstanceUserIds[i] !== teamUserIds[i]) {
                  deleteTheInstance = true;
                }
              }
            }

            if (deleteTheInstance) {
              await PuzzleInstance.destroy({
                where: {
                  id: pi.id,
                },
              });
            } else {
              const filteredPuzzlePayload = pmap[
                slug
              ].filterPuzzlePayloadForUser(
                req.context.user,
                pi.puzzlePayload,
                pi.solutionPayload,
              );
              instance = {
                ...puzzleInstanceToClientPuzzleInstance(pi),
                puzzlePayload: filteredPuzzlePayload,
              };
            }
          }

          res.status(200);
          res.send(
            JSON.stringify({
              success: true,
              puzzleName: pmap[slug].name,
              instance,
            }),
          );
        } else {
          throw new Error('No such puzzle');
        }
      } else {
        bail400('Bad request', res);
        return;
      }
    } else {
      bail400('Bad request', res);
      return;
    }
  } catch (e) {
    console.log('Failed to fetch puzzle list: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};

export const generatePuzzleInstance: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.context?.user) {
      error200('Cannot create a puzzle instance with no user', res);
      return;
    }

    if (
      req.body &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object'
    ) {
      if (
        hasOwnProperty(req.body.data, 'slug') &&
        typeof req.body.data.slug === 'string'
      ) {
        const { slug } = req.body.data;
        const pmap = puzzleMapFromList();
        let pi: PuzzleInstance | null;
        if (pmap[slug]) {
          if (req.context.team) {
            pi = await PuzzleInstance.findOne({
              where: {
                teamId: req.context.team.id,
                puzzleId: slug,
              },
            });
          } else {
            pi = await PuzzleInstance.findOne({
              where: {
                userId: req.context.user.id,
                puzzleId: slug,
              },
            });
          }
          if (pi) {
            res.status(200);
            res.send(
              JSON.stringify({ error: 'Puzzle instance already exists' }),
            );
            return;
          }

          let teamMembers: User[] = [req.context.user];
          if (req.context.team) {
            teamMembers = await User.findAll({
              where: {
                teamId: req.context.team.id,
              },
            });
          }

          const puzzle = pmap[slug];
          if (teamMembers.length < puzzle.minPlayers) {
            error200(
              'Too few players. This puzzle requires a minimum of ' +
                puzzle.minPlayers +
                ' puzzlers.',
              res,
            );
            return;
          }

          if (teamMembers.length > puzzle.maxPlayers) {
            error200(
              'Too many players. This puzzle supports a maximum of ' +
                puzzle.maxPlayers +
                ' puzzlers.',
              res,
            );
            return;
          }

          const { puzzlePayload, solutionPayload } = puzzle.createInstance(
            req.context.user,
            teamMembers,
            req.context.team !== null ? req.context.team : undefined,
          );
          const transaction = await SequelizeInstance.transaction();
          try {
            const newPI = PuzzleInstance.build({
              puzzleId: slug,
              ...(req.context.team
                ? { teamId: req.context.team.id }
                : { userId: req.context.user.id }),
              startedAt: new Date(),
              puzzlePayload,
              solutionPayload,
            });
            const instance = await newPI.save({ transaction });

            const instanceMemberPromises: Promise<PuzzleInstanceUser>[] = [];
            for (const member of teamMembers) {
              const piu = PuzzleInstanceUser.build({
                puzzleInstanceId: instance.id,
                userId: member.id,
              });
              instanceMemberPromises.push(piu.save({ transaction }));
            }
            await Promise.all(instanceMemberPromises);
            await transaction.commit();

            const filteredPuzzlePayload = puzzle.filterPuzzlePayloadForUser(
              req.context.user,
              instance.puzzlePayload,
              instance.solutionPayload,
            );

            res.status(200);
            res.send(
              JSON.stringify({
                success: true,
                instance: {
                  ...puzzleInstanceToClientPuzzleInstance(instance),
                  puzzlePayload: filteredPuzzlePayload,
                },
              }),
            );
            return;
          } catch (e) {
            console.log('Error generating puzzle instance: ' + slug, e);
            await transaction.rollback();
          }
        } else {
          bail400('No such puzzle', res);
          return;
        }
      } else {
        bail400('Bad request', res);
        return;
      }
    } else {
      bail400('Bad request', res);
      return;
    }
  } catch (e) {
    console.log('Failed to create puzzle list: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};

export const destroyPuzzleInstance: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const requesterUserId = req.context?.user?.id;
    if (!requesterUserId) {
      error200('Cannot destroy a puzzle instance with no user', res);
      return;
    }

    if (
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object' &&
      hasOwnProperty(req.body.data, 'instanceId') &&
      typeof req.body.data.instanceId === 'string'
    ) {
      const { instanceId } = req.body.data;
      const pi = await PuzzleInstance.findOne({ where: { id: instanceId } });
      if (!pi) {
        error200('No puzzle found. Puzzling, to say the least.', res);
        return;
      }

      const isDeletingOwnInstance = Boolean(
        await PuzzleInstanceUser.findOne({
          where: { userId: requesterUserId, puzzleInstanceId: instanceId },
        }),
      );
      if (!isDeletingOwnInstance) {
        error200(`Thee shouldst not destroyeth oth'r team's puzzles`, res);
        return;
      }

      await pi.destroy();

      res.status(200);
      res.send(
        JSON.stringify({
          success: true,
        }),
      );
      return;
    }

    bail400('Bad request', res);
    return;
  } catch (e) {
    console.log('Failed to destroy puzzle: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};
