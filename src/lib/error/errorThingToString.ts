import { hasOwnProperty } from '../hasOwnProperty';

export function errorThingToString(e: any): string {
  if (typeof e === 'string') {
    return e;
  } else if (typeof e === 'object' && hasOwnProperty(e, 'message')) {
    return e.message;
  }

  return String(e);
}
