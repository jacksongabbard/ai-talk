import { cloneDeep, isEqual } from 'lodash';
import { v4 as uuid } from 'uuid';

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
} from 'src/types/puzzles/BlockedTypes';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { updateBoardState } from 'src/server/puzzles/blocked/lib/updateBoardState';
import { generateBoardState } from 'src/server/puzzles/blocked/lib/generateBoardState';

export const THREAD_COLORS = [
  '#297373',
  '#416788',
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

const Blocked: Puzzle = {
  name: 'Deadlock',
  slug: 'deadlock',
  minPlayers: 1,
  maxPlayers: 6,
  published: false,
  createInstance: (user: User, members: User[], team?: Team) => {
    if (!team) {
      throw new Error('Puzzle requires a team');
    }

    const initialThreads = placeholderThreadBoardPieces.map((thread, i) => {
      const ownerID = members[i % members.length].id;

      if (thread.color === SOLUTION_BLOCK_COLOR) {
        return {
          ...thread,
          threadID: `starter-${uuid()}`,
          ownerID,
        };
      }

      return {
        ...thread,
        threadID: uuid(),
        ownerID,
      };
    });

    const starterThread = initialThreads.find((thread) =>
      thread.threadID.includes('starter'),
    );

    if (!starterThread) {
      throw new Error('No starter thread provided');
    }

    const initialBoardState = generateBoardState(
      initialThreads,
      placeholderWallBoardPiece,
    );

    if (!initialBoardState) {
      throw new Error('Invalid board state generated');
    }

    const solutionPayload: BlockedSolutionPayload = {
      threads: initialThreads,
      wall: placeholderWallBoardPiece,
      starterThreadSolvedState: {
        ...starterThread,
        column: EXIT_POSITION.column - starterThread.width + 1,
      },
      exit: EXIT_POSITION,
      boardState: initialBoardState,
    };

    const puzzlePayload: BlockedPuzzlePayload = {
      threads: initialThreads,
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

      console.log('return payload diff', puzzlePayload);
      return {
        payloadDiff: {
          // seq number comes externally

          value: payloadDiffValue,
        },
        puzzlePayload,
      };
    }

    if (action.actionType === 'reset') {
      const solutionPayload = assertIsBlockedSolutionPayload(
        puzzleInstance.solutionPayload,
      );

      const { starterThreadSolvedState: _, ...restOfPayload } = solutionPayload;

      const payloadDiffValue = {
        ...restOfPayload,
      };

      const puzzlePayload = {
        ...payloadDiffValue,
        ownedThreadIDs: [],
      };
      console.log('reset', puzzlePayload);
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

    // TODO: Check minimum number of moves?

    const validBoardState = generateBoardState(p.threads, p.wall);

    if (!validBoardState) {
      return false;
    }

    const pStarterThread = p.threads.find((thread) =>
      thread.threadID.includes('starter'),
    );

    if (!pStarterThread) {
      return false;
    }

    const sStarterThread = s.starterThreadSolvedState;

    if (!sStarterThread) {
      return false;
    }

    return isEqual(pStarterThread, sStarterThread);
  },
};

export default Blocked;
