import { makeValidator } from 'src/lib/ajv/makeValidator';
import { UUIDRegexString } from 'src/lib/validation/UUIDRegex';

export type NoYouFirstPuzzlePayload = {
  currentStates: string[];
  solvedParts: boolean[];
  enabledButtonsPerUser: {
    [uuid: string]: number[];
  };
  solutionAttempt: string;
};

export const noYouFirstPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
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
    enabledButtonsPerUser: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: {
          type: 'array',
          minItems: 1,
          maxItems: 8,
          items: {
            type: 'number',
          },
        },
      },
    },
    solutionAttempt: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: [
    'currentStates',
    'solvedParts',
    'enabledButtonsPerUser',
    'solutionAttempt',
  ],
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
  encipheredParts: string[];
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
    encipheredParts: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: {
        type: 'string',
      },
    },
    total: {
      type: 'number',
    },
  },
  additionalProperties: false,
  required: ['parts', 'total', 'encipheredParts'],
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

export type NoYouFirstCipherInstanceAction = {
  actionType: 'decipher';
  cipherIndex: number;
  partIndex: number;
};

export type NoYouFirstSolutionInstanceAction = {
  actionType: 'solve';
  solution: string;
};

export type NoYouFirstInstanceAction =
  | NoYouFirstCipherInstanceAction
  | NoYouFirstSolutionInstanceAction;

export const noYouFirstCipherInstanceActionValidator = makeValidator({
  type: 'object',
  properties: {
    actionType: {
      type: 'string',
    },
    cipherIndex: {
      type: 'number',
    },
    partIndex: {
      type: 'number',
    },
  },
  additionalProperties: false,
  required: ['actionType', 'cipherIndex', 'partIndex'],
});

export function assertIsNoYouFirstCipherInstanceAction(
  thing: unknown,
): NoYouFirstCipherInstanceAction {
  if (noYouFirstCipherInstanceActionValidator(thing)) {
    return thing as NoYouFirstCipherInstanceAction;
  }
  throw new Error(
    'Provided input is not a NoYouFirst cipher instance action: ' +
      JSON.stringify(thing),
  );
}

export const noYouFirstSolutionInstanceActionValidator = makeValidator({
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

export function assertIsNoYouFirstSolutionInstanceAction(
  thing: unknown,
): NoYouFirstSolutionInstanceAction {
  if (noYouFirstSolutionInstanceActionValidator(thing)) {
    return thing as NoYouFirstSolutionInstanceAction;
  }
  throw new Error(
    'Provided input is not a NoYouFirst solution instance action: ' +
      JSON.stringify(thing),
  );
}
