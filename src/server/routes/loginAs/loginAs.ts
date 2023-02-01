import type { Request, RequestHandler, Response } from 'express';
import { OAuth2Client } from 'googleapis-common';
import { google } from 'googleapis';

import getDotEnv from 'src/lib/dotenv';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { validateDTSG } from 'src/server/lib/dtsg';
import User from 'src/lib/db/User';
import makeUserNameFromEmail from 'src/lib/usernameUtils/makeUserNameFromEmail';
import setDatrCookie from 'src/server/lib/setDatrCookie';
import { bail400, bail500 } from '../api/util';

const config = getDotEnv();

function bail(res: Response) {
  res.status(401);
  res.send('You. Shall Not. Pass.');
}

export const loginAs: RequestHandler = async (req: Request, res: Response) => {
  if (
    req.query &&
    hasOwnProperty(req.query, 'userName') &&
    typeof req.query.userName === 'string'
  ) {
    if (!req.context?.user) {
      bail400('No user for request', res);
      return;
    }

    const { user } = req.context;

    if (!user.emailAddress.endsWith('@cord.com')) {
      bail500('nope.', res);
      return;
    }

    const loginAsUser = await User.findOne({
      where: {
        userName: req.query.userName,
      },
    });

    if (!loginAsUser) {
      bail500('No such hombre, hombre.', res);
      return;
    } else {
      await setDatrCookie(loginAsUser, req, res);
      res.redirect('/home');
      return;
    }
  }
  bail500('I dunno. Shit is all fucked.', res);
};
