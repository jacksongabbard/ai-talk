import { makeValidator } from 'src/lib/ajv/makeValidator';
import { UUIDRegexString } from 'src/lib/validation/UUIDRegex';

export type Maze = {
  size: number;
  grid: {
    [x_y: string]: {
      up?: boolean;
      right?: boolean;
      down?: boolean;
      left?: boolean;
    };
  };
  entryPoints: string[];
  exit: string;
};

export type Coord = {
  x: number;
  y: number;
};

export type Path = {
  start: Coord;
  end: Coord | null;
  steps: Coord[];
  visited: Set<string>;
};

export type SimpleMazePuzzlePayload = {
  maze: Maze;
  playerPositions: {
    [uuid: string]: { x: number; y: number };
  };
  revealedLetterGrids: {
    [uuid: string]: {
      [coord: string]: string;
    };
  };
  solutionAttempt: string;
  showInput: boolean;
};

const CoordRegexp = '^[0-8]+_[0-8]+$';
const lightsOutPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
    maze: {
      type: 'object',
      properties: {
        size: { type: 'number' },
        exit: { type: 'string' },
        entryPoints: { type: 'array', items: { type: 'string' } },
        grid: {
          type: 'object',
          patternProperties: {
            [CoordRegexp]: {
              type: 'object',
              properties: {
                up: { type: 'boolean' },
                right: { type: 'boolean' },
                down: { type: 'boolean' },
                left: { type: 'boolean' },
              },
              additionalProperties: false,
            },
          },
        },
      },
      additionalProperties: false,
      required: ['grid', 'exit', 'size', 'entryPoints'],
    },
    playerPositions: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
        },
      },
    },
    revealedLetterGrids: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: {
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            [CoordRegexp]: {
              type: 'string',
            },
          },
        },
      },
    },
    solutionAttempt: { type: 'string' },
    showInput: { type: 'boolean' },
  },
  additionalProperties: false,
  required: [
    'maze',
    'playerPositions',
    'revealedLetterGrids',
    'solutionAttempt',
    'showInput',
  ],
});

export const assertIsSimpleMazePuzzlePayload = (
  thing: any,
): SimpleMazePuzzlePayload => {
  if (lightsOutPuzzlePayloadValidator(thing)) {
    return thing as SimpleMazePuzzlePayload;
  }
  throw new Error(
    'Provided object is not a SimpleMazeSolutionPayload: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type SimpleMazeSolutionPayload = {
  playerPositions: {
    [uuid: string]: { x: number; y: number };
  };
  letterGrids: {
    [uuid: string]: {
      [coord: string]: string;
    };
  };
  secretWord: string;
  pairs: string[][];
};

export const lightsOutSolutionPayloadValidator = makeValidator({
  type: 'object',
  properties: {
    playerPositions: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
        },
      },
    },
    letterGrids: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: {
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            [CoordRegexp]: {
              type: 'string',
            },
          },
        },
      },
    },
    secretWord: { type: 'string' },
    pairs: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
  additionalProperties: false,
  required: ['playerPositions', 'letterGrids', 'secretWord', 'pairs'],
});

export const assertIsSimpleMazeSolutionPayload = (
  thing: any,
): SimpleMazeSolutionPayload => {
  if (lightsOutSolutionPayloadValidator(thing)) {
    return thing as SimpleMazeSolutionPayload;
  }
  throw new Error(
    'Provided object is not a SimpleMazeSolutionPayload: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type SimpleMazeMoveInstanceAction = {
  actionType: 'move';
  direction: 'up' | 'right' | 'down' | 'left';
};

export const lightsOutMoveInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
      pattern: '^move$',
    },
    direction: {
      type: 'string',
      pattern: '^(up|right|down|left)$',
    },
  },
  additionalProperties: false,
  required: ['actionType', 'direction'],
});

export const assertIsSimpleMazeMoveInstanceAction = (
  thing: any,
): SimpleMazeMoveInstanceAction => {
  if (lightsOutMoveInstanceActionValidator(thing)) {
    return thing as SimpleMazeMoveInstanceAction;
  }
  throw new Error(
    'Provided object is not a SimpleMazeMoveInstanceAction: ' +
      JSON.stringify(thing, null, 4),
  );
};

export type SimpleMazeSolveInstanceAction = {
  actionType: 'solve';
  solution: string;
};

export const lightsOutSolveInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
      pattern: '^solve$',
    },
    solution: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['actionType', 'solution'],
});

export const assertIsSimpleMazeSolveInstanceAction = (
  thing: any,
): SimpleMazeSolveInstanceAction => {
  if (lightsOutSolveInstanceActionValidator(thing)) {
    return thing as SimpleMazeSolveInstanceAction;
  }
  throw new Error(
    'Provided object is not a SimpleMazeSolveInstanceAction: ' +
      JSON.stringify(thing, null, 4),
  );
};
