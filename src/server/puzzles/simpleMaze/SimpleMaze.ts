import { cloneDeep, isEqual, merge } from 'lodash';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { ActionResult, Puzzle } from 'src/types/Puzzle';
import { generateMaze } from './lib/generateMaze';
import { solveMaze } from './lib/solveMaze';
import { coord } from 'src/server/ui/puzzle/simpleMaze/SimpleMaze';
import {
  SimpleMazePuzzlePayload,
  SimpleMazeSolutionPayload,
  assertIsSimpleMazeInstanceAction,
  assertIsSimpleMazePuzzlePayload,
  assertIsSimpleMazeSolutionPayload,
} from 'src/types/puzzles/SimpleMaze';
import {
  generateLetterGrid,
  hideMessageInGrids,
  makeHiddenMessage,
} from './lib/generateLetterGrids';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

const SimpleMaze: Puzzle = {
  name: 'A Simple Maze',
  slug: 'simple_maze',
  maxPlayers: 6,
  minPlayers: 2,
  published: false,
  createInstance: (user: User, members: User[], team?: Team) => {
    const size = 25;
    const maze = generateMaze(size, members.length);
    const { secretWord, pairs } = makeHiddenMessage();
    const solutionPayload: SimpleMazeSolutionPayload = {
      playerPositions: {},
      letterGrids: {},
      secretWord,
    };
    const middle = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
    for (const m of members) {
      solutionPayload.playerPositions[m.id] = middle;
      solutionPayload.letterGrids[m.id] = generateLetterGrid(25);
    }

    const secretMessage = pairs
      .map((pair) => pair[0] + 'without' + pair[1])
      .join('');
    console.log(secretMessage);
    hideMessageInGrids(solutionPayload.letterGrids, secretMessage);

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

    const puzzlePayload: SimpleMazePuzzlePayload = {
      maze,
      playerPositions,
      revealedLetterGrids: {},
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
    const p = assertIsSimpleMazePuzzlePayload(cloneDeep(puzzlePayload));

    for (let uuid in p.revealedLetterGrids) {
      if (uuid !== user.id) {
        delete p.revealedLetterGrids[uuid];
      }
    }

    return p;
  },

  filterPayloadDiffValueForUser: (
    user: User,
    payload: object,
    solutionPayload: object,
  ) => {
    const p = cloneDeep(payload);
    if (
      hasOwnProperty(p, 'revealedLetterGrids') &&
      typeof p.revealedLetterGrids === 'object'
    ) {
      for (let uuid in p.revealedLetterGrids) {
        if (uuid !== user.id && hasOwnProperty(p.revealedLetterGrids, uuid)) {
          delete p.revealedLetterGrids[uuid];
        }
      }
    }

    return payload;
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    const ia = assertIsSimpleMazeInstanceAction(action);
    const pi = assertIsSimpleMazePuzzlePayload(puzzleInstance.puzzlePayload);
    const si = assertIsSimpleMazeSolutionPayload(
      puzzleInstance.solutionPayload,
    );

    let { playerPositions } = pi;

    if (!playerPositions[user.id]) {
      throw new Error('User does not appear in playerPositions');
    }

    const currentCoord = playerPositions[user.id];
    const grid = pi.maze.grid;
    const currentCoordStr = coord(currentCoord.x, currentCoord.y);
    let revealedLetter: { [coord: string]: string } = {};
    if (ia.direction === 'up' && grid[currentCoordStr].up) {
      playerPositions = {
        [user.id]: { x: currentCoord.x, y: currentCoord.y - 1 },
      };
      revealedLetter[coord(currentCoord.x, currentCoord.y - 1)] =
        si.letterGrids[user.id][coord(currentCoord.x, currentCoord.y - 1)];
    } else if (ia.direction === 'right' && grid[currentCoordStr].right) {
      playerPositions = {
        [user.id]: { x: currentCoord.x + 1, y: currentCoord.y },
      };
      revealedLetter[coord(currentCoord.x + 1, currentCoord.y)] =
        si.letterGrids[user.id][coord(currentCoord.x + 1, currentCoord.y)];
    } else if (ia.direction === 'down' && grid[currentCoordStr].down) {
      playerPositions = {
        [user.id]: { x: currentCoord.x, y: currentCoord.y + 1 },
      };
      revealedLetter[coord(currentCoord.x, currentCoord.y + 1)] =
        si.letterGrids[user.id][coord(currentCoord.x, currentCoord.y + 1)];
    } else if (ia.direction === 'left' && grid[currentCoordStr].left) {
      playerPositions = {
        [user.id]: { x: currentCoord.x - 1, y: currentCoord.y },
      };
      revealedLetter[coord(currentCoord.x - 1, currentCoord.y)] =
        si.letterGrids[user.id][coord(currentCoord.x - 1, currentCoord.y)];
    }

    const payloadDiffValue = {
      playerPositions,
      revealedLetterGrids: { [user.id]: revealedLetter },
    };

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
    const p = assertIsSimpleMazePuzzlePayload(puzzlePayload);
    const s = assertIsSimpleMazeSolutionPayload(solutionPayload);
    return isEqual(p.playerPositions, s.playerPositions);
  },
};
export default SimpleMaze;
