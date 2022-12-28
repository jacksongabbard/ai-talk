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
      hasOwnProperty(req.body.data, 'userName') &&
        typeof req.body.data.userName === 'string' &&
        hasOwnProperty(req.body.data, 'location') &&
        typeof req.body.data.userName === 'string';

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

export const checkUserNameIsAvailable: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (
      req.query &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object' &&
      hasOwnProperty(req.body.data, 'userName') &&
      typeof req.body.data.userName === 'string' &&
      req.body.data.userName.length <= 32 // arbitrary
    ) {
      const userCount = await User.count({
        where: {
          userName: req.body.data.userName,
        },
      });
      const available = userCount === 0;

      res.status(200);
      res.send(JSON.stringify({ available }));
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
};
