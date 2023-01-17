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
  },
  additionalProperties: false,
  required: ['maze', 'playerPositions'],
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
  },
  additionalProperties: false,
  required: ['playerPositions'],
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

export type SimpleMazeInstanceAction = {
  direction: 'up' | 'right' | 'down' | 'left';
};

export const lightsOutInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    direction: {
      type: 'string',
      pattern: '^(up|right|down|left)$',
    },
  },
  additionalProperties: false,
  required: ['direction'],
});

export const assertIsSimpleMazeInstanceAction = (
  thing: any,
): SimpleMazeInstanceAction => {
  if (lightsOutInstanceActionValidator(thing)) {
    return thing as SimpleMazeInstanceAction;
  }
  throw new Error(
    'Provided object is not a SimpleMazeInstanceAction: ' +
      JSON.stringify(thing, null, 4),
  );
};