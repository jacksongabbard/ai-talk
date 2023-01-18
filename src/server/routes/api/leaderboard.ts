import type { Request, RequestHandler, Response } from 'express';
import { bail400, bail500 } from './util';
import { getPayloadFromAPIRequest } from 'src/types/api/APIRequest';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { PuzzleList, puzzleMapFromList } from 'src/server/puzzles';
import PuzzleInstance from 'src/lib/db/PuzzleInstance';
import { Op } from 'sequelize';
import Team from 'src/lib/db/Team';
import type { LeaderboardData } from 'src/types/leaderboard/Leaderboard';
import { errorThingToString } from 'src/lib/error/errorThingToString';

export const fetchLeaderboard: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user) {
    bail400('Thou shalt not load the leaderboard', res);
    return;
  }

  try {
    // We don't actually need the payload for the
    // leaderboard, but it's good to validate the
    // API request passes the sniff test.
    getPayloadFromAPIRequest(req);
  } catch (e) {
    bail400('Bad input', res);
  }

  const puzzleInstances = await PuzzleInstance.findAll({
    where: {
      [Op.and]: [
        {
          solvedAt: {
            [Op.ne]: null,
          },
          teamId: {
            [Op.ne]: null,
          },
        },
      ],
    },
  });

  if (!puzzleInstances || !puzzleInstances.length) {
    bail400('No leaderboard information to show, oddly.', res);
    return;
  }

  const teamIds: Set<string> = new Set();
  for (let pi of puzzleInstances) {
    teamIds.add(pi.teamId);
  }
  const teams = await Team.findAll({
    where: {
      id: {
        [Op.in]: Array.from(teamIds),
      },
    },
  });

  if (!teams || !teams.length) {
    bail500('Leaderboard is borked. We suck at programming.', res);
    return;
  }

  const puzzles = puzzleMapFromList();
  for (const slug in puzzles) {
    if (puzzles[slug].published === false) {
      delete puzzles[slug];
    }
  }
  const leaderboard: LeaderboardData = {};
  for (let slug in puzzles) {
    if (!leaderboard[slug]) {
      leaderboard[slug] = {
        puzzleName: puzzles[slug].name,
        leaders: [],
      };
    }
  }

  const teamIdsToTeamName: { [teamId: string]: string } = {};
  for (let t of teams) {
    if (!teamIdsToTeamName[t.id]) {
      teamIdsToTeamName[t.id] = t.teamName;
    }
  }

  try {
    for (let pi of puzzleInstances) {
      if (leaderboard[pi.puzzleId]) {
        if (!pi.solvedAt) {
          throw new Error(
            'Unsolved puzzle instance in leaderboard calculation!? Unpossible!',
          );
        }
        leaderboard[pi.puzzleId].leaders.push({
          teamName: teamIdsToTeamName[pi.teamId] || 'error: unknown team',
          solveTime: pi.solvedAt?.getTime() - pi.createdAt.getTime(),
        });
      }
    }

    for (let puzzleSlug in leaderboard) {
      leaderboard[puzzleSlug].leaders.sort((a, b) => {
        return a.solveTime - b.solveTime;
      });
    }

    res.status(200);
    res.send(JSON.stringify(leaderboard));
    return;
  } catch (e) {
    bail500(errorThingToString(e), res);
    return;
  }
};
