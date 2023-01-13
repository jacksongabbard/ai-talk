import type { Request, RequestHandler, Response } from 'express';
import { bail400 } from './util';
import { getCordClientToken } from 'src/server/lib/cord';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { getPayloadFromAPIRequest } from 'src/types/api/APIRequest';

export const getCordClientAuthToken: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user) {
    bail400('No can do -- no user, no team, no Cord.', res);
    return;
  }

  console.log(req.body);
  const payload = getPayloadFromAPIRequest(req);

  let clientAuthToken = '';
  if (
    hasOwnProperty(payload, 'global') &&
    typeof payload.global === 'boolean'
  ) {
    if (payload.global === false) {
      throw new Error('Wtf are you doing? Are you anti-globalism?!');
    }
    clientAuthToken = getCordClientToken(req.context.user);
  } else if (req.context.team) {
    clientAuthToken = getCordClientToken(req.context.user, req.context.team);
  } else {
  }

  res.status(200);
  res.send({ success: true, clientAuthToken });
};
