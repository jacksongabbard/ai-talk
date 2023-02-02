import { makeValidator } from 'src/lib/ajv/makeValidator';
import type {
  SOLUTION_BLOCK_COLOR,
  THREAD_COLORS,
  WALL_COLOR,
} from 'src/server/puzzles/blocked/Blocked';

export type boardPiece = {
  color:
    | typeof THREAD_COLORS[number]
    | typeof SOLUTION_BLOCK_COLOR
    | typeof WALL_COLOR;
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
  exit: { row: number; column: number };
  boardState: string[][];
  ownedThreadIDs: string[];
};

const blockedPuzzlePayloadValidator = makeValidator({
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
  required: ['threads', 'exit', 'boardState'],
});

export const assertIsBlockedPuzzledPayload = (
  thing: any,
): BlockedPuzzlePayload => {
  if (blockedPuzzlePayloadValidator(thing)) {
    return thing as BlockedPuzzlePayload;
  }

  throw new Error(
    'Provided object is not a BlockedPuzzlePayload: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type BlockedSolutionPayload = {
  threads: thread[];
  exit: { row: number; column: number };
  wall: boardPiece;
  starterThreadSolvedState: thread;
  boardState: string[][];
};

export const blockedSolutionPayloadValidator = makeValidator({
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
    exit: {
      type: 'object',
    },
    starterThreadSolvedState: {
      type: 'object',
    },
    boardState: {
      type: 'array',
      items: { type: 'array' },
    },
  },
  additionalProperties: false,

  required: ['threads', 'boardState', 'exit', 'starterThreadSolvedState'],
});

export const assertIsBlockedSolutionPayload = (
  thing: any,
): BlockedSolutionPayload => {
  if (blockedSolutionPayloadValidator(thing)) {
    return thing as BlockedSolutionPayload;
  }
  throw new Error(
    'Provided object is not a BlockedSolutionPayload: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type BlockedMoveInstanceAction = {
  actionType: 'move';
  threadID: string;
  direction: 1 | -1;
};

export const blockedMoveInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
      pattern: '^move$',
    },
    threadID: {
      type: 'string',
    },
    direction: {
      type: 'number',
      pattern: '^(1|-1)$',
    },
  },
  additionalProperties: false,

  required: ['actionType', 'threadID', 'direction'],
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

export type BlockedResetInstanceAction = {
  actionType: 'reset';
};

export const blockedResetInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
      pattern: '^reset$',
    },
  },
  additionalProperties: false,

  required: ['actionType'],
});
