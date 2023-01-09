import { makeValidator } from 'src/lib/ajv/makeValidator';

export type NoYouFirstPuzzlePayload = {
  encipheredParts: string[];
  currentStates: string[];
  solvedParts: boolean[];
  enabledButtonsPerUser: {
    [uuid: string]: number[];
  };
};

export const noYouFirstPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
    encipheredParts: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'string',
      },
    },
    currentStates: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'string',
      },
    },
    solvedParts: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'boolean',
      },
    },
  },
  additionalProperties: false,
  required: ['encipheredParts', 'currentStates', 'solvedParts'],
});

export function assertIsNoYouFirstPuzzlePayload(
  thing: unknown,
): NoYouFirstPuzzlePayload {
  if (noYouFirstPuzzlePayloadValidator(thing)) {
    return thing as NoYouFirstPuzzlePayload;
  }
  throw new Error(
    'Provided input is not a NoYouFirst puzzle payload: ' +
      JSON.stringify(thing),
  );
}

export type NoYouFirstSolutionPayload = {
  parts: number[];
  total: number;
};

export type NoYouFirstInstance = {
  puzzlePayload: NoYouFirstPuzzlePayload;
  solutionPayload: NoYouFirstSolutionPayload;
};

export const noYouFirstSolutionPayloadValidator = makeValidator({
  type: 'object',
  properties: {
    parts: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'number',
      },
    },
    total: {
      type: 'number',
    },
  },
  additionalProperties: false,
  required: ['parts', 'total'],
});

export function assertIsNoYouFirstSolutionPayload(
  thing: unknown,
): NoYouFirstSolutionPayload {
  if (noYouFirstSolutionPayloadValidator(thing)) {
    return thing as NoYouFirstSolutionPayload;
  }
  throw new Error(
    'Provided input is not a NoYouFirst solution payload: ' +
      JSON.stringify(thing),
  );
}
