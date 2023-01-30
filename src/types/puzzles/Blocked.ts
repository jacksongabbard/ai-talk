import { makeValidator } from 'src/lib/ajv/makeValidator';

// empty object for now
export type BlockedPuzzlePayload = Record<string, never>;

const blockedPuzzleValidator = makeValidator({
  type: 'object',
  properties: {
  },
  additionalProperties: false,
  required: [
  ],
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

