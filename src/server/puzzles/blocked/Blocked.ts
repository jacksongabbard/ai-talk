import { cloneDeep, isEqual, merge } from 'lodash';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import {
  assertIsBlockedMoveInstanceAction,
  assertIsBlockedPuzzledPayload,
  BlockedPuzzlePayload,
  BlockedSolutionPayload,
  boardPiece,
  thread,
} from 'src/types/puzzles/BlockedTypes';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { threadId } from 'worker_threads';

export enum THREAD_COLORS {
  maroon = '#800000',
  purple = '#800080',
  fuchsia = '#FF00FF',
  green = '#008000',
  lime = '#00FF00',
  olive = '#808000',
  yellow = '#FFFF00',
  navy = '#000080',
  blue = '#0000FF',
  teal = '#008080',
  aqua = '#00FFFF',
  black = '#000000',
  red = '#FF0000',
  silver = '#C0C0C0',
  white = '#FFFFFF',
  grey = '#808080',
}

const placeholderThreadBoardPieces: boardPiece[] = [
  {
    color: THREAD_COLORS.maroon,
    width: 1,
    height: 2,
    row: 0,
    column: 2,
  },
  {
    color: THREAD_COLORS.aqua,
    width: 3,
    height: 1,
    row: 1,
    column: 3,
  },
  {
    color: THREAD_COLORS.blue,
    width: 1,
    height: 2,
    row: 2,
    column: 3,
  },
  {
    color: THREAD_COLORS.fuchsia,
    width: 1,
    height: 3,
    row: 2,
    column: 5,
  },
  {
    color: THREAD_COLORS.navy,
    width: 2,
    height: 1,
    row: 3,
    column: 1,
  },
  {
    color: THREAD_COLORS.green,
    width: 1,
    height: 2,
    row: 3,
    column: 4,
  },
  {
    color: THREAD_COLORS.purple,
    width: 1,
    height: 2,
    row: 4,
    column: 1,
  },
  {
    color: THREAD_COLORS.yellow,
    width: 2,
    height: 1,
    row: 4,
    column: 2,
  },
];

const placeholderStarterThreadBoardPiece: boardPiece = {
  color: THREAD_COLORS.red,
  width: 2,
  height: 1,
  row: 2,
  column: 1,
};

const placeholderWallBoardPiece: boardPiece = {
  color: THREAD_COLORS.black,
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
      // check for open space vertical up
      if (updatedBoardState[updatedThread.row][updatedThread.column] !== 'o') {
        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][updatedThread.column] = 't';

      updatedBoardState[updatedThread.row + updatedThread.height][
        updatedThread.column
      ] = 'o';
    }

    if (direction === -1) {
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
        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row + updatedThread.height - 1][
        updatedThread.column
      ] = 't';

      updatedBoardState[updatedThread.row - 1][updatedThread.column] = 'o';
    }
  } else {
    if (direction === 1) {
      // check for oob tail end of block
      if (updatedThread.column + updatedThread.width > 5) {
        return [currentBoardState, false];
      }

      // check for open space horizontal right
      if (
        updatedBoardState[updatedThread.row][
          updatedThread.column + updatedThread.width - 1
        ] !== 'o'
      ) {
        return [currentBoardState, false];
      }

      updatedBoardState[updatedThread.row][
        updatedThread.column + updatedThread.width - 1
      ] = 't';

      updatedBoardState[updatedThread.row][updatedThread.column - 1] = 'o';
    }
    if (direction === -1) {
      // check for open space horizontal lef
      if (updatedBoardState[updatedThread.row][updatedThread.column] !== 'o') {
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

    const initialThreads = placeholderThreadBoardPieces.map((thread, i) => {
      const ownerID = members[i % members.length].id;

      return {
        ...thread,
        threadID: `blocked-puzzled-${team.id}-thread-${i}`,
        ownerID,
      };
    });

    const solutionPayload: BlockedSolutionPayload = {
      exit: EXIT_POSITION,
      starterThread: {
        threadID: `blocked-puzzle-${team.id}`,
        ownerID: null,
        ...placeholderStarterThreadBoardPiece,
        row: 2,
        column: 3,
      },
    };

    const starterThread = {
      threadID: `blocked-puzzle-${team.id}`,
      ownerID: null,
      ...placeholderStarterThreadBoardPiece,
    };

    let initialBoardState = [
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
      ['o', 'o', 'o', 'o', 'o', 'o'],
    ];

    for (const thread of initialThreads) {
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

    initialBoardState[starterThread.row][starterThread.column] = 's';

    if (starterThread.width > 1) {
      for (let i = 1; i < starterThread.width; i++) {
        initialBoardState[starterThread.row][starterThread.column + i] = 's';
      }
    }

    if (starterThread.height > 1) {
      for (let i = 1; i < starterThread.height; i++) {
        initialBoardState[starterThread.row + i][starterThread.column] = 's';
      }
    }

    initialBoardState[placeholderWallBoardPiece.row][
      placeholderWallBoardPiece.column
    ] = 'w';

    const puzzlePayload: BlockedPuzzlePayload = {
      threads: initialThreads,
      wall: placeholderWallBoardPiece,
      starterThread,
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
      .filter((thread) => thread.ownerID === user.id)
      .map((thread) => thread.threadID);

    return {
      ...payload,
      ownedThreadIDs: [...ownedThreadIDs, payload.starterThread.threadID],
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

      const threadToUpdate =
        payload.threads.find((thread) => thread.threadID === threadID) ??
        payload.starterThread.threadID === threadID
          ? payload.starterThread
          : null;

      if (!threadToUpdate) {
        throw new Error('threadID not found');
      }

      const isStarterThread = !threadToUpdate.threadID.includes('thread');

      if (
        threadToUpdate.ownerID !== null &&
        threadToUpdate.ownerID !== user.id
      ) {
        throw new Error('User does not have permissions to thread');
      }

      const threadVertical = threadToUpdate.height > threadToUpdate.width;

      const updatedPosition = {
        row: threadVertical
          ? threadToUpdate.row - direction
          : threadToUpdate.row,
        column: threadVertical
          ? threadToUpdate.column
          : threadToUpdate.column + direction,
      };

      const updatedThread = {
        ...threadToUpdate,
        ...updatedPosition,
      };

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
          puzzlePayload: puzzleInstance.puzzlePayload,
        };
      }

      if (isStarterThread) {
        const payloadDiffValue = {
          boardState: updatedBoardState,
          starterThread: updatedThread,
        };

        const puzzlePayload = merge(
          puzzleInstance.puzzlePayload,
          payloadDiffValue,
        );

        return {
          payloadDiff: {
            // seq number comes externally

            value: payloadDiffValue,
          },
          puzzlePayload,
        };
      }

      const unchangedThreads = payload.threads.filter(
        (currentThread) => currentThread.threadID !== threadToUpdate.threadID,
      );

      const payloadDiffValue = {
        threads: [...unchangedThreads, updatedThread],
        boardState: updatedBoardState,
      };

      const puzzlePayload = merge(
        puzzleInstance.puzzlePayload,
        payloadDiffValue,
      );

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
    return isEqual(puzzlePayload, solutionPayload);
  },
};

export default Blocked;
