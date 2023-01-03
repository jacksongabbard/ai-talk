import { makeValidator } from 'src/lib/ajv/makeValidator';

export const SET_PUZZLE = 'set_puzzle';
export const INSTANCE_ACTION = 'instance_action';

export type SocketMessageType = 'set_puzzle' | 'instance_action' | 'hello';

export function assertSocketMessageType(s: string): SocketMessageType {
  if (s === SET_PUZZLE || s === INSTANCE_ACTION || s === 'hello') {
    return s as SocketMessageType;
  }
  throw new Error('Invalid socket message type');
}

export type SocketMessage = {
  type: SocketMessageType;
  payload: object;
};

export const validateIsSocketMessage = makeValidator({
  type: 'object',
  properties: {
    type: { type: 'string' },
    payload: { type: 'object' },
  },
  required: ['type', 'payload'],
  additionalProperties: false,
});

export function assertIsSocketMessage(thing: any): SocketMessage {
  if (validateIsSocketMessage(thing)) {
    const t = thing as SocketMessage;
    assertSocketMessageType(t.type);
    return t;
  }

  throw new Error('Provided value is not a SocketMessage');
}

export type SetPuzzleMessage = {
  puzzleName: string;
};

export const validateIsSetPuzzleMessage = makeValidator({
  type: 'object',
  properties: {
    puzzleName: { type: 'string' },
  },
  required: ['puzzleName'],
  additionalProperties: false,
});

export function assertIsSetPuzzleMessage(thing: any): SetPuzzleMessage {
  if (validateIsSetPuzzleMessage(thing)) {
    const t = thing as SetPuzzleMessage;
    return t;
  }

  throw new Error('Provided value is not a SocketMessage');
}
