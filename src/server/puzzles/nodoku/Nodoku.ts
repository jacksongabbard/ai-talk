import { cloneDeep, isEqual, merge } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import { generateSudoku } from './lib/generateSudoku';
import {
  assertIsNodokuInstanceAction,
  assertIsNodokuPuzzlePayload,
  assertIsNodokuSolutionPayload,
} from 'src/types/puzzles/NodokuTypes';

const Nodoku: Puzzle = {
  name: 'Nodoku',
  slug: 'nodoku',
  minPlayers: 2,
  maxPlayers: 6,
  createInstance: (user: User, members: User[], team?: Team) => {
    const grid = generateSudoku();

    const solutionPayload: object = { grid };
    const puzzlePayload: object = {
      grid: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      correct: [
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
      ],
    };

    return {
      puzzlePayload,
      solutionPayload,
    };
  },

  filterPayloadForUser: (user: User, payload: object) => {
    return payload;
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    const ia = assertIsNodokuInstanceAction(action);
    const oldPayload = assertIsNodokuPuzzlePayload(
      puzzleInstance.puzzlePayload,
    );
    const solutionPayload = assertIsNodokuSolutionPayload(
      puzzleInstance.solutionPayload,
    );
    const grid = cloneDeep(oldPayload.grid);

    grid[ia.y][ia.x] = ia.value;
    const correct = cloneDeep(oldPayload.correct);
    correct[ia.y][ia.x] = ia.value === solutionPayload.grid[ia.y][ia.x];

    const payloadDiffValue = {
      grid,
      correct,
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
    const s = assertIsNodokuSolutionPayload(solutionPayload);
    const p = assertIsNodokuPuzzlePayload(puzzlePayload);
    return isEqual(p.grid, s.grid);
  },
};

export default Nodoku;
