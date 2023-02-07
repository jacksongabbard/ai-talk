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

export type DeadlockPuzzlePayload = {
  threads: thread[];
  walls: boardPiece[];
  exit: { row: number; column: number };
  boardState: string[][];
  ownedThreadIDs: string[];
};

const deadlockPuzzlePayloadValidator = makeValidator({
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

export const assertIsDeadlockPuzzledPayload = (
  thing: any,
): DeadlockPuzzlePayload => {
  if (deadlockPuzzlePayloadValidator(thing)) {
    return thing as DeadlockPuzzlePayload;
  }

  throw new Error(
    'Provided object is not a DeadlockPuzzlePayload: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type DeadlockSolutionPayload = {
  threads: thread[];
  exit: { row: number; column: number };
  walls: boardPiece[];
  starterThreadSolvedState: thread;
  boardState: string[][];
  moves: string;
  clusterSize: string;
};

export const deadlockSolutionPayloadValidator = makeValidator({
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

export const assertIsDeadlockSolutionPayload = (
  thing: any,
): DeadlockSolutionPayload => {
  if (deadlockSolutionPayloadValidator(thing)) {
    return thing as DeadlockSolutionPayload;
  }
  throw new Error(
    'Provided object is not a DeadlockSolutionPayload: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type DeadlockMoveInstanceAction = {
  actionType: 'move';
  threadID: string;
  direction: 1 | -1;
};

export const deadlockMoveInstanceActionValidator = makeValidator({
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

export const assertIsDeadlockMoveInstanceAction = (
  thing: any,
): DeadlockMoveInstanceAction => {
  if (deadlockMoveInstanceActionValidator(thing)) {
    return thing as DeadlockMoveInstanceAction;
  }

  throw new Error(
    'Provided object is not a DeadlockMoveInstanceAction: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type DeadlockResetInstanceAction = {
  actionType: 'reset';
};

export type DeadlockInstanceAction =
  | DeadlockResetInstanceAction
  | DeadlockMoveInstanceAction;

export const deadlockResetInstanceActionValidator = makeValidator({
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
