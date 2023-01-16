import AJV, { Schema } from 'ajv';

/*
const schema = {
  type: 'object',
  properties: {
    on: { type: 'boolean' },
  },
  required: ['foo'],
  additionalProperties: false,
};
*/

export function makeValidator(schema: Schema) {
  const ajv = new AJV({
    verbose: true,
  });
  return ajv.compile(schema);
}
