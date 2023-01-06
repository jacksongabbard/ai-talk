import { makeValidator } from 'src/lib/ajv/makeValidator';
import { UUIDRegexString } from 'src/lib/validation/UUIDRegex';

export type PushTheButtonPuzzlePayloadType = {
  pressed: { [uuid: string]: boolean };
  uuidsToNames: { [uuid: string]: string };
};

const pushTheButtonPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
    pressed: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: { type: 'boolean' },
      },
    },
    uuidsToNames: {
      type: 'object',
      patternProperties: {
        [UUIDRegexString]: { type: 'string' },
      },
    },
  },
  additionalProperties: false,
  required: ['pressed', 'uuidsToNames'],
});

export function assertIsPushTheButtonPuzzlePayload(thing: any) {
  if (pushTheButtonPuzzlePayloadValidator(thing)) {
    return thing as PushTheButtonPuzzlePayloadType;
  }
  throw new Error(
    'Object provided is not a PushTheButtonPuzzlePayloadType: ' +
      JSON.stringify(thing, null, 4),
  );
}
