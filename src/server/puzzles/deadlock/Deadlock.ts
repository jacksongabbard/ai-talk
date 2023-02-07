import { cloneDeep, isEqual } from 'lodash';
import { v4 as uuid } from 'uuid';

import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import type { Puzzle } from 'src/types/Puzzle';
import type { ActionResult } from 'src/types/Puzzle';
import type PuzzleInstance from 'src/lib/db/PuzzleInstance';
import {
  assertIsDeadlockMoveInstanceAction,
  assertIsDeadlockPuzzledPayload,
  assertIsDeadlockSolutionPayload,
  DeadlockPuzzlePayload,
  DeadlockSolutionPayload,
  SOLUTION_BLOCK_COLOR,
  WALL_COLOR,
} from 'src/types/puzzles/DeadlockTypes';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { updateBoardState } from 'src/server/puzzles/deadlock/lib/updateBoardState';
import { generateBoardState } from 'src/server/puzzles/deadlock/lib/generateBoardState';
import { getBoardPieces } from 'src/server/puzzles/deadlock/lib/getBoardPieces';

const EXIT_POSITION: DeadlockPuzzlePayload['exit'] = {
  row: 2,
  column: 5,
};

const Deadlock: Puzzle = {
  name: 'Deadlock',
  slug: 'deadlock',
  minPlayers: 1,
  maxPlayers: 6,
  published: false,
  createInstance: (user: User, members: User[], team?: Team) => {
    if (!team) {
      throw new Error('Puzzle requires a team');
    }

    const { boardPieces, moves, clusterSize } = getBoardPieces();

    const wallPieces = boardPieces.filter(
      (boardPiece) => boardPiece.color === WALL_COLOR,
    );

    const initialThreads = boardPieces
      .filter((boardPiece) => boardPiece.color !== WALL_COLOR)
      .map((thread, i) => {
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

    const initialBoardState = generateBoardState(initialThreads, wallPieces);

    if (!initialBoardState) {
      throw new Error('Invalid board state generated');
    }

    const solutionPayload: DeadlockSolutionPayload = {
      threads: initialThreads,
      walls: wallPieces,
      starterThreadSolvedState: {
        ...starterThread,
        column: EXIT_POSITION.column - starterThread.width + 1,
      },
      exit: EXIT_POSITION,
      boardState: initialBoardState,
      moves,
      clusterSize,
    };

    const puzzlePayload: DeadlockPuzzlePayload = {
      threads: initialThreads,
      walls: wallPieces,
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
    const payload = assertIsDeadlockPuzzledPayload(cloneDeep(puzzlePayload));

    const ownedThreadIDs = payload.threads
      .filter((thread) => thread.ownerID === user.id || thread.ownerID === null)
      .map((thread) => thread.threadID);

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
    if (
      !hasOwnProperty(action, 'actionType') ||
      typeof action.actionType !== 'string'
    ) {
      throw new Error('Invalid instance action');
    }

    if (action.actionType === 'move') {
      const moveAction = assertIsDeadlockMoveInstanceAction(action);
      const payload = assertIsDeadlockPuzzledPayload(
        puzzleInstance.puzzlePayload,
      );
      const { threadID, direction } = moveAction;

      const threadToUpdate = payload.threads.find(
        (thread) => thread.threadID === threadID,
      );

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

      const unchangedThreads = payload.threads.filter(
        (currentThread) => currentThread.threadID !== threadToUpdate.threadID,
      );

      const payloadDiffValue = {
        threads: [...unchangedThreads, updatedThread],
        boardState: updatedBoardState,
      };

      const puzzlePayload = {
        ...payload,
        ...payloadDiffValue,
      };

      return {
        payloadDiff: {
          // seq number comes externally
          value: payloadDiffValue,
        },
        puzzlePayload,
      };
    }

    if (action.actionType === 'reset') {
      const solutionPayload = assertIsDeadlockSolutionPayload(
        puzzleInstance.solutionPayload,
      );

      const {
        starterThreadSolvedState: _starterThreadSolvedState,
        moves: _moves,
        clusterSize: _clusterSize,
        ...restOfPayload
      } = solutionPayload;

      const payloadDiffValue = assertIsDeadlockPuzzledPayload({
        ...restOfPayload,
      });

      const puzzlePayload = {
        ...payloadDiffValue,
        ownedThreadIDs: [],
      };

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
    const p = assertIsDeadlockPuzzledPayload(puzzlePayload);
    const s = assertIsDeadlockSolutionPayload(solutionPayload);

    const validBoardState = generateBoardState(p.threads, p.walls);

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

export default Deadlock;
