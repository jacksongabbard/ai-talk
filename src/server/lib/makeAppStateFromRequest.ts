import type { Request } from 'express';
import type { TAppContext } from '../state/AppContext';

export function makeAppStateFromRequest(
  req: Request,
  extras?: Omit<TAppContext, 'user' | 'team'>,
) {
  const user = req?.context?.user || undefined;
  const team = req?.context?.team || undefined;

  return {
    user,
    team,
    ...(extras || {}),
  };
}
