import type { Request, RequestHandler, Response } from 'express';

import { PuzzleList } from 'src/server/puzzles';
import { bail400, error200 } from './util';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { ClientPuzzle, Puzzle, puzzleToClientPuzzle } from 'src/types/Puzzle';
import PuzzleInstance from 'src/lib/db/PuzzleInstance';
import {
  ClientPuzzleInstance,
  puzzleInstanceToClientPuzzleInstance,
} from 'src/types/ClientPuzzleInstance';
import PuzzleInstanceUser from 'src/lib/db/PuzzleInstanceUser';
import User from 'src/lib/db/User';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';

function puzzleMapFromList(pl: Puzzle[]): { [slug: string]: Puzzle } {
  const slugToName: { [slug: string]: Puzzle } = {};
  for (let ii = 0; ii < PuzzleList.length; ii++) {
    slugToName[PuzzleList[ii].slug] = PuzzleList[ii];
  }
  return slugToName;
}

export const listPuzzles: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const slugToPuzzle = puzzleMapFromList(PuzzleList);
    const slugToClientPuzzle: { [slug: string]: ClientPuzzle } = {};
    for (let key in slugToPuzzle) {
      slugToClientPuzzle[key] = puzzleToClientPuzzle(slugToPuzzle[key]);
    }
    res.status(200);
    res.send(JSON.stringify({ success: true, puzzles: slugToClientPuzzle }));
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
    if (!req.context?.team) {
      throw new Error('Request has no team');
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
        const pmap = puzzleMapFromList(PuzzleList);
        if (pmap[slug]) {
          let instance: ClientPuzzleInstance | null = null;
          const pi = await PuzzleInstance.findOne({
            where: {
              teamId: req.context.team.id,
            },
          });

          if (pi) {
            const instanceMembers = await PuzzleInstanceUser.findAll({
              where: {
                puzzleInstanceId: pi.id,
              },
            });

            const teamMembers = await User.findAll({
              where: {
                teamId: req.context.team.id,
              },
            });

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
              instance = puzzleInstanceToClientPuzzleInstance(pi);
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
    if (!req.context?.team) {
      throw new Error('Request has no team');
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
        const pmap = puzzleMapFromList(PuzzleList);
        if (pmap[slug]) {
          const pi = await PuzzleInstance.findOne({
            where: {
              teamId: req.context.team.id,
            },
          });

          if (pi) {
            res.status(200);
            res.send(
              JSON.stringify({ error: 'Puzzle instance already exists' }),
            );
            return;
          }

          const teamMembers = await User.findAll({
            where: {
              teamId: req.context.team.id,
            },
          });

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
            req.context.team,
            teamMembers,
          );
          const transaction = await SequelizeInstance.transaction();
          try {
            const newPI = PuzzleInstance.build({
              puzzleId: slug,
              teamId: req.context.team.id,
              startedAt: new Date(),
              puzzlePayload,
              solutionPayload,
            });
            const instance = await newPI.save({ transaction });

            const instanceMemberPromises: Promise<PuzzleInstanceUser>[] = [];
            for (let member of teamMembers) {
              const piu = PuzzleInstanceUser.build({
                puzzleInstanceId: instance.id,
                userId: member.id,
              });
              instanceMemberPromises.push(piu.save({ transaction }));
            }
            await Promise.all(instanceMemberPromises);
            await transaction.commit();

            res.status(200);
            res.send(
              JSON.stringify({
                success: true,
                instance: puzzleInstanceToClientPuzzleInstance(instance),
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
