import type { Request } from 'express';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

export type ProfileProps = {
  user?: User;
  team?: Team;
};

export function makeProfilePropsFromRequest(req: Request): ProfileProps {
  const user = req?.context?.user || undefined;
  const team = req?.context?.team || undefined;

  return {
    user,
    team,
  };
}
