import type { Request } from 'express';
import type { TAppContext } from '../state/AppContext';
import { userToClientUser } from 'src/types/ClientUser';
import { teamToClientTeam } from 'src/types/ClientTeam';

export function makeAppStateFromRequest(
  req: Request,
  extras?: Omit<TAppContext, 'user' | 'team'>,
) {
  const user = req?.context?.user || undefined;
  const team = req?.context?.team || undefined;

  return {
    user: user ? userToClientUser(user) : undefined,
    team: team ? teamToClientTeam(team) : undefined,
    ...(extras || {}),
  };
}
