import type { Request, RequestHandler, Response } from 'express';

import getDotEnv from 'src/lib/dotenv';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { validateDTSG } from 'src/server/lib/dtsg';
import User from 'src/lib/db/User';

const config = getDotEnv();

function bail400(errorMessage: string, res: Response) {
  res.status(400);
  res.send(JSON.stringify({ error: errorMessage }));
}

export const saveProfile: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  console.log(req.body);
  try {
    if (
      req.query &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object'
    ) {
      console.log(req.body.data);
      res.status(200);
      res.send(JSON.stringify({ success: true }));
      return;
    } else {
      bail400('Request contained no data', res);
      return;
    }
  } catch (e) {
    console.log('Failed to save profile: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }

  bail400('Unexpected error', res);
};
