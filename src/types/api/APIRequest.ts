import type { Request } from 'express';
import { makeValidator } from 'src/lib/ajv/makeValidator';

type APIRequest = {
  data: object;
};

export const validateIsAPIRequest = makeValidator({
  type: 'object',
  properties: {
    data: {
      type: 'object',
    },
  },
  required: ['data'],
  additionalProperties: false,
});

export function getPayloadFromAPIRequest(req: Request): object {
  if (req.body && typeof req.body === 'object') {
    if (validateIsAPIRequest(req.body)) {
      return (req.body as APIRequest).data;
    }
  }

  throw new Error('Invalid API request');
}
