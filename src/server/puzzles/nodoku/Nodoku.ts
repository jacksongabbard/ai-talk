import { cloneDeep, isEqual, merge, shuffle } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import { SolvedSudoku, generateSudoku } from './lib/generateSudoku';
import {
  NodokuPuzzlePayloadType,
  NodokuSolutionInstanceAction,
  NodokuSolutionPayloadType,
  assertIsNodokuEntryInstanceAction,
  assertIsNodokuPuzzlePayload,
  assertIsNodokuSolutionInstanceAction,
  assertIsNodokuSolutionPayload,
} from 'src/types/puzzles/NodokuTypes';
import { makeFlatGrid } from 'src/lib/puzzles/nodoku/makeFlatGrid';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

function toFlatGrid(s: SolvedSudoku): { [x_y: string]: number } {
  const fg: { [x_y: string]: number } = {};
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      fg[x + '_' + y] = s[y][x];
    }
  }
  return fg;
}

function makeMeta(g: SolvedSudoku): {
  metacode: string;
  metavalues: { [x_y: string]: number };
} {
  const metacodeArray = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const metacode = metacodeArray.join('');
  const metavalues: { [x_y: string]: number } = {};

  for (let y = 0; y < 9; y++) {
    const x = g[y].indexOf(metacodeArray[y]);
    metavalues[x + '_' + y] = metacodeArray[y];
  }

  return {
    metacode,
    metavalues,
  };
}

const handleSolve = (
  action: NodokuSolutionInstanceAction,
  instance: PuzzleInstance,
): ActionResult => {
  const a = assertIsNodokuSolutionInstanceAction(action);
  const payloadDiffValue = {
    grid: {},
    correct: {},
    metavalues: {},
    solutionAttempt: a.solution,
  };
  const puzzlePayload = merge(instance.puzzlePayload, payloadDiffValue);
  return {
    payloadDiff: {
      // seq number comes externally
      value: payloadDiffValue,
    },
    puzzlePayload,
  };
};

const Nodoku: Puzzle = {
  name: 'Nodoku',
  slug: 'nodoku',
  minPlayers: 2,
  maxPlayers: 6,
  createInstance: (user: User, members: User[], team?: Team) => {
    const arrayGrid = generateSudoku();
    const grid = toFlatGrid(arrayGrid);

    const { metacode, metavalues } = makeMeta(arrayGrid);
    const rowsPerUser: { [uuid: string]: number[] } = {};
    for (let i = 0; i < 9; i++) {
      let u = members[i % members.length];
      if (!rowsPerUser[u.id]) {
        rowsPerUser[u.id] = [];
      }
      rowsPerUser[u.id].push(i);
    }

    const solutionPayload: NodokuSolutionPayloadType = {
      grid,
      metavalues,
      metacode,
      rowsPerUser,
    };
    const puzzlePayload: NodokuPuzzlePayloadType = {
      grid: makeFlatGrid(0),
      correct: makeFlatGrid(false),
      metavalues: {},
      solutionAttempt: '',
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
    const p = cloneDeep(assertIsNodokuPuzzlePayload(puzzlePayload));
    const s = assertIsNodokuSolutionPayload(solutionPayload);
    const metavalues = cloneDeep(p.metavalues);
    for (let key in metavalues) {
      const [x, y] = key.split('_');
      if (!s.rowsPerUser[user.id].includes(parseInt(y, 10))) {
        delete metavalues[key];
      }
    }
    const newPayload = {
      ...p,
      metavalues,
    };
    return newPayload;
  },

  filterPayloadDiffValueForUser: (
    user: User,
    payloadDiffValue: object,
    solutionPayload: object,
  ) => {
    const p = assertIsNodokuPuzzlePayload(payloadDiffValue);
    const s = assertIsNodokuSolutionPayload(solutionPayload);
    const metavalues = cloneDeep(p.metavalues);
    for (let key in metavalues) {
      const [x, y] = key.split('_');
      if (!s.rowsPerUser[user.id].includes(parseInt(y, 10))) {
        delete metavalues[key];
      }
    }
    const newPayload = {
      ...p,
      metavalues,
    };
    return newPayload;
  },

  receiveAction: (
    user: User,
    puzzleInstance: PuzzleInstance,
    action: object,
  ): ActionResult => {
    if (
      !hasOwnProperty(action, 'actionType') ||
      typeof action.actionType !== 'string'
    ) {
      throw new Error(
        'Bad input: Provided action is not a Nodoku instance action: ' +
          JSON.stringify(action, null, 4),
      );
    }

    if (action.actionType === 'solve') {
      const a = assertIsNodokuSolutionInstanceAction(action);
      return handleSolve(a, puzzleInstance);
    }

    const ia = assertIsNodokuEntryInstanceAction(action);

    const oldPayload = assertIsNodokuPuzzlePayload(
      puzzleInstance.puzzlePayload,
    );
    const solutionPayload = assertIsNodokuSolutionPayload(
      puzzleInstance.solutionPayload,
    );
    const grid = cloneDeep(oldPayload.grid);

    grid[ia.coord] = ia.value;
    const isCorrect = ia.value === solutionPayload.grid[ia.coord];
    let metavalues = oldPayload.metavalues;
    if (isCorrect && solutionPayload.metavalues[ia.coord]) {
      metavalues[ia.coord] = solutionPayload.metavalues[ia.coord];
    }

    const payloadDiffValue = {
      grid: { [ia.coord]: ia.value },
      correct: { [ia.coord]: isCorrect },
      metavalues,
      solutionAttempt: oldPayload.solutionAttempt,
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
    return isEqual(p.solutionAttempt, s.metacode);
  },
};

export default Nodoku;
