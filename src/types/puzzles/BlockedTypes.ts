import { makeValidator } from 'src/lib/ajv/makeValidator';

export const THREAD_COLORS = [
  '#297373',
  '#313715',
  '#cc3363',
  '#9c528b',
  '#6457A6',
  '#822e81',
  '#004e89',
  '#3aaed8',
  '#f18f01',
  '#FE5F55',
  '#9E643C',
  '#8d775f',
  '#512D38',
] as const;
export const SOLUTION_BLOCK_COLOR = '#931621';
export const WALL_COLOR = '#717568';

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
  walls: boardPiece[];
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
    walls: {
      type: 'array',
      items: {
        type: 'object',
      },
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
  walls: boardPiece[];
  starterThreadSolvedState: thread;
  boardState: string[][];
  moves: string;
  clusterSize: string;
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
    walls: {
      type: 'array',
      items: {
        type: 'object',
      },
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
    moves: { type: 'string' },
    clusterSize: { type: 'string' },
  },
  additionalProperties: false,

  required: [
    'threads',
    'boardState',
    'exit',
    'starterThreadSolvedState',
    'moves',
    'clusterSize',
  ],
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

export type BlockedInstanceAction =
  | BlockedResetInstanceAction
  | BlockedMoveInstanceAction;

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
