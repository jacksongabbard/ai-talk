import type { Request } from 'express';

export function makeAppStateFromRequest(req: Request) {
  const user = req?.context?.user || undefined;
  const team = req?.context?.team || undefined;

  return {
    user,
    team,
  };
}
