export const SET_PUZZLE = 'set_puzzle';
export const INSTANCE_ACTION = 'instance_action';

export type SocketMessageType = 'set_puzzle' | 'instance_action';

export function assertSocketMessageType(s: string): SocketMessageType {
  if (s === SET_PUZZLE || s === INSTANCE_ACTION) {
    return s as SocketMessageType;
  }
  throw new Error('Invalid socket message type');
}
