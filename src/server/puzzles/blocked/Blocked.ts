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
    row: 1,
    column: 3,
  },
  {
    color: THREAD_COLORS.aqua,
    width: 3,
    height: 1,
    row: 2,
    column: 4,
  },
  {
    color: THREAD_COLORS.blue,
    width: 1,
    height: 2,
    row: 3,
    column: 4,
  },
  {
    color: THREAD_COLORS.fuchsia,
    width: 1,
    height: 3,
    row: 3,
    column: 6,
  },
  {
    color: THREAD_COLORS.navy,
    width: 2,
    height: 1,
    row: 4,
    column: 2,
  },
  {
    color: THREAD_COLORS.green,
    width: 1,
    height: 2,
    row: 4,
    column: 5,
  },
  {
    color: THREAD_COLORS.maroon,
    width: 1,
    height: 2,
    row: 5,
    column: 2,
  },
  {
    color: THREAD_COLORS.yellow,
    width: 2,
    height: 1,
    row: 5,
    column: 3,
  },
];

const placeholderStarterThreadBoardPiece: boardPiece = {
  color: THREAD_COLORS.red,
  width: 2,
  height: 1,
  row: 3,
  column: 2,
};

const placeholderWallBoardPiece: boardPiece = {
  color: THREAD_COLORS.black,
  width: 1,
  height: 1,
  row: 2,
  column: 1,
};

const EXIT_POSITION: BlockedPuzzlePayload['exit'] = {
  row: 3,
  column: 6,
};

const updateBoardState = (
  updatedThread: thread,
  threadVertical: boolean,
  currentBoardState: string[][],
  direction: 1 | -1,
) => {
  const updatedBoardState = currentBoardState;
  if (threadVertical) {
    if (direction === 1) {
      updatedBoardState[updatedThread.row - 1][updatedThread.column - 1] = 't';

      updatedBoardState[updatedThread.row - 1 + updatedThread.height][
        updatedThread.column - 1
      ] = 'o';
    }

    if (direction === -1) {
      updatedBoardState[updatedThread.row - 1 + updatedThread.height][
        updatedThread.column - 1
      ] = 't';

      updatedBoardState[updatedThread.row - 1 - 1][updatedThread.column - 1] =
        'o';
    }
  } else {
    if (direction === 1) {
      updatedBoardState[updatedThread.row - 1][updatedThread.column - 1] = 't';

      updatedBoardState[updatedThread.row - 1][
        updatedThread.column - 1 - updatedThread.width
      ] = 'o';
    }
    if (direction === -1) {
      updatedBoardState[updatedThread.row - 1][
        updatedThread.column - 1 - updatedThread.width
      ] = 't';

      updatedBoardState[updatedThread.row - 1][updatedThread.column - 1 + 1] =
        'o';
    }
  }

  return updatedBoardState;
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
        row: 3,
        column: 4,
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
      initialBoardState[thread.row - 1][thread.column - 1] = 't';

      if (thread.width > 1) {
        for (let i = 1; i < thread.width; i++) {
          initialBoardState[thread.row - 1][thread.column - 1 + i] = 't';
        }
      }

      if (thread.height > 1) {
        for (let i = 1; i < thread.height; i++) {
          initialBoardState[thread.row - 1 + i][thread.column - 1] = 't';
        }
      }
    }

    initialBoardState[starterThread.row - 1][starterThread.column - 1] = 'st';

    if (starterThread.width > 1) {
      for (let i = 1; i < starterThread.width; i++) {
        initialBoardState[starterThread.row - 1][starterThread.column - 1 + i] =
          'st';
      }
    }

    if (starterThread.height > 1) {
      for (let i = 1; i < starterThread.height; i++) {
        initialBoardState[starterThread.row - 1 + i][starterThread.column - 1] =
          'st';
      }
    }

    initialBoardState[placeholderWallBoardPiece.row - 1][
      placeholderWallBoardPiece.column - 1
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
      const { thread, direction } = moveAction;

      if (thread.ownerID !== null && thread.ownerID !== user.id) {
        throw new Error('User does not have permissions to thread');
      }

      const threadVertical = thread.height > thread.width;

      const updatedPosition = {
        row: threadVertical ? thread.row + direction : 0,
        column: threadVertical ? 0 : thread.column + direction,
      };

      if (
        payload.boardState[updatedPosition.row - 1][
          updatedPosition.column - 1
        ] !== 'o' ||
        updatedPosition.row > 6 ||
        updatedPosition.column > 6 ||
        updatedPosition.row < 1 ||
        updatedPosition.column < 1
      ) {
        return {
          payloadDiff: {
            value: {},
          },
          puzzlePayload: payload,
        };
      }

      const updatedThread = {
        ...thread,
        ...updatedPosition,
      };

      const unchangedThreads = payload.threads.filter(
        (currentThread) => currentThread.threadID !== thread.threadID,
      );

      const updatedBoardState = updateBoardState(
        updatedThread,
        threadVertical,
        payload.boardState,
        direction,
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
