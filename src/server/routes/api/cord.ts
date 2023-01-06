import type { Request, RequestHandler, Response } from 'express';
import { bail400 } from './util';
import { getCordClientToken } from 'src/server/lib/cord';

export const getCordClientAuthToken: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user || !req.context.team) {
    bail400('No can do -- no user, no team, no Cord.', res);
    return;
  }

  const clientAuthToken = getCordClientToken(
    req.context.user,
    req.context.team,
  );

  res.status(200);
  res.send({ success: true, clientAuthToken });
};
