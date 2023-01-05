import type { Request, RequestHandler, Response } from 'express';
import { OAuth2Client } from 'googleapis-common';
import { google } from 'googleapis';

import getDotEnv from 'src/lib/dotenv';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { validateDTSG } from 'src/server/lib/dtsg';
import User from 'src/lib/db/User';
import makeUserNameFromEmail from 'src/lib/usernameUtils/makeUserNameFromEmail';
import setDatrCookie from 'src/server/lib/setDatrCookie';

const config = getDotEnv();

function bail(res: Response) {
  res.status(401);
  res.send('You. Shall Not. Pass.');
}

export const googleOAuthRedirect: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (
      req.query &&
      hasOwnProperty(req.query, 'state') &&
      typeof req.query.state === 'string'
    ) {
      const dtsgValue = await validateDTSG(req.query.state, req);
      if (!dtsgValue) {
        bail(res);
        return;
      }

      if (req.query.error) {
        res.status(500);
        res.send(req.query.error);
        return;
      }

      if (!req.query.code || typeof req.query.code !== 'string') {
        res.status(500);
        res.send('No OAuth code');
        return;
      }
      let host = config.SERVER_HOST;
      if (!config.IS_PROD) {
        host += ':' + config.SERVER_PORT;
      }
      const client = new OAuth2Client({
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        redirectUri: 'https://' + host + '/google-oauth-redirect',
      });
      // Get access and refresh tokens (if access_type is offline)
      let { tokens } = await client.getToken(req.query.code);

      client.setCredentials(tokens);

      google.options({ auth: client });
      const oauth2 = google.oauth2('v2');
      const userInfoResponse = await oauth2.userinfo.get({});

      if (
        userInfoResponse &&
        userInfoResponse.data &&
        userInfoResponse.data.email
      ) {
        const { email, picture } = userInfoResponse.data;

        const user = await User.findOne({
          where: {
            emailAddress: email.toLowerCase().trim(),
          },
        });

        // If we don't have a user, we need to go through the user
        // creation flow.
        if (!user) {
          const userName = makeUserNameFromEmail(email);
          const newUser = User.build({
            userName,
            emailAddress: email,
            location: 'Puzzletown, Terra',
            profilePic: picture || '',
            active: false,
            teamId: null,
          });

          await newUser.save();

          try {
            await setDatrCookie(newUser, req, res);
          } catch (e) {
            console.log((e as Error).message);
            res.status(500);
            res.send('Unexpected error');
            return;
          }

          res.redirect('/home');
          return;
        } else {
          // Do a login + redirect
          await setDatrCookie(user, req, res);
          res.redirect('/home');
        }

        return;
      } else {
        bail(res);
        return;
      }
    }
  } catch (e) {
    console.log('Failed Google OAuth authentication: ', e);
    bail(res);
    return;
  }

  bail(res);
};
