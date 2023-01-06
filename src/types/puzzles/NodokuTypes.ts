import { makeValidator } from 'src/lib/ajv/makeValidator';

export type NodokuPuzzlePayloadType = {
  grid: number[][];
};

const nodokuPuzzlePayloadValidator = makeValidator({
  type: 'object',
  properties: {
    grid: {
      type: 'array',
      maxItems: 9,
      items: [
        {
          type: 'array',
          maxItems: 9,
          items: [{ type: 'number', minimum: 0, maximum: 9 }],
        },
      ],
    },
  },
  additionalProperties: false,
  required: ['grid'],
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
