import { cloneDeep, isEqual, merge } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import {
  assertIsBlockedMoveInstanceAction,
  assertIsBlockedPuzzledPayload,
  assertIsBlockedSolutionPayload,
  BlockedPuzzlePayload,
  BlockedSolutionPayload,
  boardPiece,
  thread,
} from 'src/types/puzzles/BlockedTypes';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export const THREAD_COLORS = [
  '#297373',
  '#0A1045',
  '#00C2D1',
  '#ED33B9',
  '#512D38',
  '#B27092',
  '#6457A6',
  '#498467',
  '#9E643C',
  '#485696',
] as const;
export const SOLUTION_BLOCK_COLOR = '#FE5F55';
export const WALL_COLOR = '#717568';

const placeholderThreadBoardPieces: boardPiece[] = [
  {
    color: SOLUTION_BLOCK_COLOR,
    width: 2,
    height: 1,
    row: 2,
    column: 1,
  },
  {
    color: THREAD_COLORS[0],
    width: 1,
    height: 2,
    row: 0,
    column: 2,
  },
  {
    color: THREAD_COLORS[1],
    width: 3,
    height: 1,
    row: 1,
    column: 3,
  },
  {
    color: THREAD_COLORS[2],
    width: 1,
    height: 2,
    row: 2,
    column: 3,
  },
  {
    color: THREAD_COLORS[3],
    width: 1,
    height: 3,
    row: 2,
    column: 5,
  },
  {
    color: THREAD_COLORS[4],
    width: 2,
    height: 1,
    row: 3,
    column: 1,
  },
  {
    color: THREAD_COLORS[5],
    width: 1,
    height: 2,
    row: 3,
    column: 4,
  },
  {
    color: THREAD_COLORS[6],
    width: 1,
    height: 2,
    row: 4,
    column: 1,
  },
  {
    color: THREAD_COLORS[7],
    width: 2,
    height: 1,
    row: 4,
    column: 2,
  },
];

const placeholderWallBoardPiece: boardPiece = {
  color: WALL_COLOR,
  width: 1,
  height: 1,
  row: 1,
  column: 0,
};

const EXIT_POSITION: BlockedPuzzlePayload['exit'] = {
  row: 2,
  column: 5,
};

const updateBoardState = (
  updatedThread: thread,
  threadVertical: boolean,
  currentBoardState: string[][],
  direction: 1 | -1,
): [string[][], boolean] => {
  const updatedBoardState = currentBoardState;
  console.log('current bs in update', currentBoardState);

  // starting positions OOB
  if (
    updatedThread.row > 5 ||
    updatedThread.column > 5 ||
    updatedThread.row < 0 ||
    updatedThread.column < 0
  ) {
    console.log('starting pos OOB');
    return [currentBoardState, false];
  }

  if (threadVertical) {
    if (direction === 1) {
      // check for oob tail end of block
      if (updatedThread.row + updatedThread.height - 1 > 5) {
        console.log('oob tailend of vert down');
        return [currentBoardState, false];
      }
      // check for open space vertical down
      if (
        updatedBoardState[updatedThread.row + updatedThread.height - 1][
          updatedThread.column
        ] !== 'o'
      ) {
        console.log('no open space vert down');

        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row + updatedThread.height - 1][
        updatedThread.column
      ] = 't';

      updatedBoardState[updatedThread.row - 1][updatedThread.column] = 'o';
    }

    if (direction === -1) {
      // check for open space vertical up
      if (updatedBoardState[updatedThread.row][updatedThread.column] !== 'o') {
        console.log('no open space vert up');

        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][updatedThread.column] = 't';

      updatedBoardState[updatedThread.row + updatedThread.height][
        updatedThread.column
      ] = 'o';
    }
  } else {
    if (direction === 1) {
      // check for oob tail end of block
      if (updatedThread.column + updatedThread.width - 1 > 5) {
        console.log('check for oob tail end of block');

        return [currentBoardState, false];
      }

      // check for open space horizontal right
      if (
        updatedBoardState[updatedThread.row][
          updatedThread.column + updatedThread.width - 1
        ] !== 'o'
      ) {
        console.log('no space horiz right');

        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][
        updatedThread.column + updatedThread.width - 1
      ] = 't';

      updatedBoardState[updatedThread.row][updatedThread.column - 1] = 'o';
    }
    if (direction === -1) {
      // check for open space horizontal left
      if (updatedBoardState[updatedThread.row][updatedThread.column] !== 'o') {
        console.log('no space horiz left');

        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][updatedThread.column] = 't';

      updatedBoardState[updatedThread.row][
        updatedThread.column + updatedThread.width
      ] = 'o';
    }
  }

  return [updatedBoardState, true];
};

const Blocked: Puzzle = {
  name: 'Blocked',
  slug: 'blocked',
  minPlayers: 1,
  maxPlayers: 6,
  published: false,
  createInstance: (user: User, members: User[], team?: Team) => {
    if (!team) {
      throw new Error('Puzzle requires a team');
    }

    const initialThreads = placeholderThreadBoardPieces
      .filter((thread) => thread.color !== SOLUTION_BLOCK_COLOR)
      .map((thread, i) => {
        const ownerID = members[i % members.length].id;

        return {
          ...thread,
          threadID: `blocked-puzzled-${team.id}-thread-${i}`,
          ownerID,
        };
      });

    const starterThreadData = placeholderThreadBoardPieces.find(
      (thread) => thread.color === SOLUTION_BLOCK_COLOR,
    );

    if (!starterThreadData) {
      throw new Error('No starter thread data provided');
    }

    const starterThread = {
      ...starterThreadData,
      threadID: `blocked-puzzle-${team.id}`,
      ownerID: null,
    };

    const solutionPayload: BlockedSolutionPayload = {
      exit: EXIT_POSITION,
      threads: [{ ...starterThread, ...EXIT_POSITION }],
    };

    const initialBoardState = [
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
    ];

    const allThreads = [...initialThreads, starterThread];

    for (const thread of allThreads) {
      initialBoardState[thread.row][thread.column] = 't';

      if (thread.width > 1) {
        for (let i = 1; i < thread.width; i++) {
          initialBoardState[thread.row][thread.column + i] = 't';
        }
      }

      if (thread.height > 1) {
        for (let i = 1; i < thread.height; i++) {
          initialBoardState[thread.row + i][thread.column] = 't';
        }
      }
    }

    initialBoardState[placeholderWallBoardPiece.row][
      placeholderWallBoardPiece.column
    ] = 'w';

    const puzzlePayload: BlockedPuzzlePayload = {
      threads: allThreads,
      wall: placeholderWallBoardPiece,
      exit: EXIT_POSITION,
      boardState: initialBoardState,
      ownedThreadIDs: [],
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
    const payload = assertIsBlockedPuzzledPayload(cloneDeep(puzzlePayload));

    const ownedThreadIDs = payload.threads
      .filter((thread) => thread.ownerID === user.id || thread.ownerID === null)
      .map((thread) => thread.threadID);

    console.log({ ownedThreadIDs });
    console.log('threads,', payload.threads);

    return {
      ...payload,
      ownedThreadIDs: [...ownedThreadIDs],
    };
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
    console.log('get action');
    if (
      !hasOwnProperty(action, 'actionType') ||
      typeof action.actionType !== 'string'
    ) {
      throw new Error('Invalid instance action');
    }

    if (action.actionType === 'move') {
      const moveAction = assertIsBlockedMoveInstanceAction(action);
      const payload = assertIsBlockedPuzzledPayload(
        puzzleInstance.puzzlePayload,
      );
      const { threadID, direction } = moveAction;

      const threadToUpdate = payload.threads.find(
        (thread) => thread.threadID === threadID,
      );

      // console.log('thead to update ??', threadToUpdate, direction);

      if (!threadToUpdate) {
        throw new Error('threadID not found');
      }

      if (
        threadToUpdate.ownerID !== null &&
        threadToUpdate.ownerID !== user.id
      ) {
        throw new Error('User does not have permissions to thread');
      }

      const threadVertical = threadToUpdate.height > threadToUpdate.width;

      const updatedPosition = {
        row: threadVertical
          ? threadToUpdate.row + direction
          : threadToUpdate.row,
        column: threadVertical
          ? threadToUpdate.column
          : threadToUpdate.column + direction,
      };

      const updatedThread = {
        ...threadToUpdate,
        ...updatedPosition,
      };

      // console.log({ updatedThread });

      const [updatedBoardState, updated] = updateBoardState(
        updatedThread,
        threadVertical,
        payload.boardState,
        direction,
      );

      if (!updated) {
        return {
          payloadDiff: {
            value: {},
          },
          puzzlePayload: payload,
        };
      }
      // console.log('og boardstate', payload.boardState);
      // console.log('updated board state', updatedBoardState);

      const unchangedThreads = payload.threads.filter(
        (currentThread) => currentThread.threadID !== threadToUpdate.threadID,
      );

      // console.log({ unchangedThreads });

      const payloadDiffValue = {
        threads: [...unchangedThreads, updatedThread],
        boardState: updatedBoardState,
      };

      // const puzzlePayload = merge(payload, payloadDiffValue);
      const puzzlePayload = {
        ...payload,
        ...payloadDiffValue,
      };

      const payloadThreadIDs = puzzlePayload.threads.map(
        (thread) => thread.threadID,
      );
      console.log({ payloadThreadIDs });
      // console.log({ puzzlePayload });
      const diffThreadIDs = payloadDiffValue.threads.map(
        (thread) => thread.threadID,
      );
      console.log({ diffThreadIDs });
      console.log(JSON.stringify(payloadDiffValue, undefined, 3));

      console.log('return payload diff', puzzlePayload);
      return {
        payloadDiff: {
          // seq number comes externally

          value: payloadDiffValue,
        },
        puzzlePayload,
      };
    }

    throw new Error('Invalid instance action');
  },

  isSolved: (puzzlePayload, solutionPayload) => {
    const p = assertIsBlockedPuzzledPayload(puzzlePayload);
    const s = assertIsBlockedSolutionPayload(solutionPayload);

    // TODO: Check valid board state and minimum number of moves?

    const pStarterThread = p.threads.find(
      (thread) => !thread.threadID.includes('thread'),
    );

    const sStarterThread = s.threads[0];

    return isEqual(pStarterThread, sStarterThread);
  },
};

export default Blocked;
