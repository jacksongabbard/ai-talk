import { makeValidator } from 'src/lib/ajv/makeValidator';
import { UUIDRegexString } from 'src/lib/validation/UUIDRegex';

export type PushTheButtonPuzzlePayloadType = { [uuid: string]: boolean };

const pushTheButtonPuzzlePayloadValidator = makeValidator({
  type: 'object',
  patternProperties: {
    [UUIDRegexString]: { type: 'boolean' },
  },
  additionalProperties: false,
});

export function assertIsPushTheButtonPuzzlePayload(thing: any) {
  console.log(pushTheButtonPuzzlePayloadValidator(thing));
  if (pushTheButtonPuzzlePayloadValidator(thing)) {
    return thing as PushTheButtonPuzzlePayloadType;
  }
  throw new Error(
    'Object provided is not a PushTheButtonPuzzlePayloadType: ' +
      JSON.stringify(thing, null, 4),
  );
}
