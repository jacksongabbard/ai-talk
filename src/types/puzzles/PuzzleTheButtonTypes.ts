import { makeValidator } from 'src/lib/ajv/makeValidator';

export type PushTheButtonPuzzlePayloadType = { [uuid: string]: boolean };

const pushTheButtonPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
    UUIDRegexString: { type: 'boolean' },
  },
  additionalProperties: false,
});

export function assertIsPushTheButtonPuzzlePayload(thing: any) {
  if (pushTheButtonPuzzlePayloadValidator(thing)) {
    return thing as PushTheButtonPuzzlePayloadType;
  }
  throw new Error('Object provided is not a PushTheButtonPuzzlePayloadType');
}
