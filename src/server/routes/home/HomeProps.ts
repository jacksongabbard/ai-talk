import type { Request } from 'express';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';

export type HomeProps = {
  user?: User;
  team?: Team;
};

export function makeHomePropsFromRequest(req: Request): HomeProps {
  const user = req?.context?.user || undefined;
  const team = req?.context?.team || undefined;

  return {
    user,
    team,
  };
}
