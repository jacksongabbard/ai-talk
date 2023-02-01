import { makeValidator } from 'src/lib/ajv/makeValidator';
import type { THREAD_COLORS } from 'src/server/puzzles/blocked/Blocked';

export type boardPiece = {
  color: THREAD_COLORS;
  width: number;
  height: number;
  row: number;
  column: number;
};

export type thread = boardPiece & {
  threadID: string;
  ownerID: string | null;
};

export type BlockedPuzzlePayload = {
  threads: thread[];
  wall: boardPiece;
  starterThread: thread;
  exit: { row: number; column: number };
  boardState: string[][];
  ownedThreadIDs: string[];
};
export type BlockedSolutionPayload = {
  starterThread: thread;
  exit: { row: number; column: number };
};

const blockedPuzzleValidator = makeValidator({
  type: 'object',
  properties: {
    threads: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    wall: {
      type: 'object',
    },
    starterThread: {
      type: 'object',
    },
    exit: {
      type: 'object',
    },
    boardState: {
      type: 'array',
      items: { type: 'array' },
    },
    ownedThreadIDs: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  additionalProperties: false,
  required: ['threads', 'starterThread', 'exit', 'boardState'],
});

export const assertIsBlockedPuzzledPayload = (
  thing: any,
): BlockedPuzzlePayload => {
  if (blockedPuzzleValidator(thing)) {
    return thing as BlockedPuzzlePayload;
  }
  throw new Error(
    'Provided object is not a BlockedPuzzlePayload: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type BlockedMoveInstanceAction = {
  actionType: 'move';
  thread: thread;
  direction: 1 | -1;
};

export const blockedMoveInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
      pattern: '^move$',
    },
    thread: {
      type: 'object',
    },
    direction: {
      type: 'number',
      pattern: '^(1|-1)$',
    },
  },
});

export const assertIsBlockedMoveInstanceAction = (
  thing: any,
): BlockedMoveInstanceAction => {
  if (blockedMoveInstanceActionValidator(thing)) {
    return thing as BlockedMoveInstanceAction;
  }

  throw new Error(
    'Provided object is not a BlockedMoveInstanceAction: ' +
      JSON.stringify(thing, null, 4),
  );
};
