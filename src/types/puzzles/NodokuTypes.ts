import { makeValidator } from 'src/lib/ajv/makeValidator';

export type NodokuPuzzlePayloadType = {
  grid: number[][];
  correct: boolean[][];
};

const nodokuPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
    grid: {
      type: 'array',
      maxItems: 9,
      items: {
        type: 'array',
        maxItems: 9,
        items: { type: 'number', minimum: 0, maximum: 9 },
      },
    },
    correct: {
      type: 'array',
      maxItems: 9,
      items: {
        type: 'array',
        maxItems: 9,
        items: { type: 'boolean' },
      },
    },
  },
  additionalProperties: false,
  required: ['grid', 'correct'],
});

export function assertIsNodokuPuzzlePayload(thing: any) {
  if (nodokuPuzzlePayloadValidator(thing)) {
    return thing as NodokuPuzzlePayloadType;
  }
  throw new Error(
    'Object provided is not a NodokuPuzzlePayloadType: ' +
      JSON.stringify(thing, null, 4),
  );
}

export type NodokuSolutionPayloadType = {
  grid: number[][];
};

const nodokuSolutionPayloadValidator = makeValidator({
  type: 'object',
  properties: {
    grid: {
      type: 'array',
      maxItems: 9,
      items: {
        type: 'array',
        maxItems: 9,
        items: { type: 'number', minimum: 0, maximum: 9 },
      },
    },
  },
  additionalProperties: false,
  required: ['grid'],
});

export function assertIsNodokuSolutionPayload(thing: any) {
  if (nodokuSolutionPayloadValidator(thing)) {
    return thing as NodokuSolutionPayloadType;
  }
  throw new Error(
    'Object provided is not a NodokuSolutionPayloadType: ' +
      JSON.stringify(thing, null, 4),
  );
}

export type NodokuInstanceActionType = {
  x: number;
  y: number;
  value: number;
};

const nodokuInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    x: {
      type: 'number',
      minimum: 0,
      maximum: 8,
    },
    y: {
      type: 'number',
      minimum: 0,
      maximum: 8,
    },
    value: {
      type: 'number',
      minimum: 0,
      maximum: 9,
    },
  },
  additionalProperties: false,
  required: ['x', 'y', 'value'],
});

export function assertIsNodokuInstanceAction(thing: any) {
  if (nodokuInstanceActionValidator(thing)) {
    return thing as NodokuInstanceActionType;
  }
  throw new Error(
    'Object provided is not a NodokuInstanceAction: ' +
      JSON.stringify(thing, null, 4),
  );
}
