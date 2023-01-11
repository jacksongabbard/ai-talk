import { makeValidator } from 'src/lib/ajv/makeValidator';
import { UUIDRegexString } from 'src/lib/validation/UUIDRegex';

const CoordRegexp = '^[0-8]_[0-8]$';

export type NodokuPuzzlePayloadType = {
  grid: { [x_y: string]: number };
  correct: { [x_y: string]: boolean };
  metavalues: { [x_y: string]: number };
  solutionAttempt: string;
};

const nodokuPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
    grid: {
      type: 'object',
      patternProperties: {
        [CoordRegexp]: {
          type: 'number',
        },
      },
    },
    correct: {
      type: 'object',
      patternProperties: {
        [CoordRegexp]: {
          type: 'boolean',
        },
      },
    },
    metavalues: {
      type: 'object',
      patternProperties: {
        [CoordRegexp]: {
          type: 'number',
        },
      },
    },
    solutionAttempt: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['grid', 'correct', 'metavalues', 'solutionAttempt'],
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
  grid: { [x_y: string]: number };
  metavalues: { [x_y: string]: number };
  metacode: string;
  rowsPerUser: { [uuid: string]: number[] };
};

const nodokuSolutionPayloadValidator = makeValidator({
  type: 'object',
  properties: {
    grid: {
      type: 'object',
      patternProperties: {
        [CoordRegexp]: {
          type: 'number',
        },
      },
    },
    metavalues: {
      type: 'object',
      patternProperties: {
        [CoordRegexp]: {
          type: 'number',
        },
      },
    },
    metacode: { type: 'string' },
    rowsPerUser: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: { type: 'array', items: { type: 'number' } },
      },
    },
  },
  additionalProperties: false,
  required: ['grid', 'metavalues', 'metacode', 'rowsPerUser'],
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

export type NodokuEntryInstanceActionType = {
  actionType: 'entry';
  coord: string;
  value: number;
};

const nodokuEntryInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
      pattern: '^(entry|solve)$',
    },
    coord: {
      type: 'string',
      pattern: CoordRegexp,
    },
    value: {
      type: 'number',
      minimum: 0,
      maximum: 9,
    },
  },
  additionalProperties: false,
  required: ['coord', 'value'],
});

export function assertIsNodokuEntryInstanceAction(thing: any) {
  if (nodokuEntryInstanceActionValidator(thing)) {
    return thing as NodokuEntryInstanceActionType;
  }
  throw new Error(
    'Object provided is not a NodokuEntryInstanceAction: ' +
      JSON.stringify(thing, null, 4),
  );
}

export type NodokuSolutionInstanceAction = {
  actionType: 'solve';
  solution: string;
};

export const nodokuSolutionInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
    },
    solution: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['actionType', 'solution'],
});

export function assertIsNodokuSolutionInstanceAction(
  thing: unknown,
): NodokuSolutionInstanceAction {
  if (nodokuSolutionInstanceActionValidator(thing)) {
    return thing as NodokuSolutionInstanceAction;
  }
  throw new Error(
    'Provided input is not a Nodoku solution instance action: ' +
      JSON.stringify(thing),
  );
}
