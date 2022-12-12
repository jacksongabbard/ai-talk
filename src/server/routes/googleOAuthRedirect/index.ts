import type { Request, RequestHandler, Response } from 'express';
import { OAuth2Client } from 'googleapis-common';
import { google } from 'googleapis';

import getDotEnv from 'src/lib/dotenv';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { validateDTSG } from 'src/server/lib/dtsg';

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

      const client = new OAuth2Client({
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        redirectUri: 'https://local.ohffs.io:8197/google-oauth-redirect',
      });
      // Get access and refresh tokens (if access_type is offline)
      let { tokens } = await client.getToken(req.query.code);

      client.setCredentials(tokens);

      // google.auth.

      res.status(200);
      res.send('Looking good');
      return;
    }
  } catch (e) {
    console.log('Failed Google OAuth authentication: ', e);
    bail(res);
    return;
  }

  bail(res);
};
