import { isEqual, merge } from 'lodash';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { ActionResult, Puzzle } from 'src/types/Puzzle';
import { generateMaze } from './lib/generateMaze';
import { solveMaze } from './lib/solveMaze';
import { coord } from 'src/server/ui/puzzle/lightsOut/LightsOut';
import {
  LightsOutSolutionPayload,
  assertIsLightsOutInstanceAction,
  assertIsLightsOutPuzzlePayload,
  assertIsLightsOutSolutionPayload,
} from 'src/types/puzzles/LightsOut';

const LightsOut: Puzzle = {
  name: 'Lights Out',
  slug: 'lights_out',
  maxPlayers: 6,
  minPlayers: 2,
  createInstance: (user: User, members: User[], team?: Team) => {
    const size = 17;
    const maze = generateMaze(size, members.length);

    const solvePath = solveMaze(
      maze,
      { x: 0, y: 0 },
      { x: Math.floor(size / 2), y: Math.floor(size / 2) },
    );
    const solutionPayload: LightsOutSolutionPayload = {
      playerPositions: {},
    };
    const middle = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
    for (const m of members) {
      solutionPayload.playerPositions[m.id] = middle;
    }

    const playerPositions: { [uuid: string]: { x: number; y: number } } = {};
    if (members.length >= 2) {
      // Top Left
      playerPositions[members[0].id] = { x: 0, y: 0 };
      // Bottom Right
      playerPositions[members[1].id] = { x: size - 1, y: size - 1 };
    }

    // Top Right
    if (members.length >= 3) {
      playerPositions[members[2].id] = { x: size - 1, y: 0 };
    }

    // Bottom Left
    if (members.length >= 4) {
      playerPositions[members[3].id] = { x: 0, y: size - 1 };
    }

    // Left Center
    if (members.length >= 5) {
      playerPositions[members[4].id] = { x: 0, y: Math.floor(size / 2) };
    }

    // Right Center
    if (members.length >= 6) {
      playerPositions[members[5].id] = { x: size - 1, y: Math.floor(size / 2) };
    }

    const puzzlePayload: object = {
      maze,
      playerPositions,
    };

    return {
      puzzlePayload,
      solutionPayload,
    };
  },

  filterPuzzlePayloadForUser: (
    user: User,
    puzzlePayload: object,
    solutionPayload: object,
  ) => {
    return puzzlePayload;
  },

  filterPayloadDiffValueForUser: (
    user: User,
    payload: object,
    solutionPayload: object,
  ) => {
    return payload;
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    const ia = assertIsLightsOutInstanceAction(action);
    const pi = assertIsLightsOutPuzzlePayload(puzzleInstance.puzzlePayload);

    let { playerPositions } = pi;

    if (!playerPositions[user.id]) {
      throw new Error('User does not appear in playerPositions');
    }

    const occupiedPositions = Object.values(playerPositions).map((c) =>
      coord(c.x, c.y),
    );
    const currentCoord = playerPositions[user.id];
    const grid = pi.maze.grid;
    const currentCoordStr = coord(currentCoord.x, currentCoord.y);
    if (ia.direction === 'up' && grid[currentCoordStr].up) {
      playerPositions = {
        [user.id]: { x: currentCoord.x, y: currentCoord.y - 1 },
      };
    } else if (ia.direction === 'right' && grid[currentCoordStr].right) {
      playerPositions = {
        [user.id]: { x: currentCoord.x + 1, y: currentCoord.y },
      };
    } else if (ia.direction === 'down' && grid[currentCoordStr].down) {
      playerPositions = {
        [user.id]: { x: currentCoord.x, y: currentCoord.y + 1 },
      };
    } else if (ia.direction === 'left' && grid[currentCoordStr].left) {
      playerPositions = {
        [user.id]: { x: currentCoord.x - 1, y: currentCoord.y },
      };
    }

    const payloadDiffValue = { playerPositions };

    const puzzlePayload = merge(puzzleInstance.puzzlePayload, payloadDiffValue);

    return {
      payloadDiff: {
        // seq number comes externally
        value: payloadDiffValue,
      },
      puzzlePayload,
    };
  },

  isSolved: (puzzlePayload, solutionPayload) => {
    const p = assertIsLightsOutPuzzlePayload(puzzlePayload);
    const s = assertIsLightsOutSolutionPayload(solutionPayload);
    return isEqual(p.playerPositions, s.playerPositions);
  },
};
export default LightsOut;
