import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Auth from './Auth';
import Chrome from 'src/server/ui/Chrome';
import getDotEnv from 'src/lib/dotenv';
import { encrypt } from 'src/server/lib/crypto';
import getRandomFill from 'src/server/lib/getRandomFill';

const dotenv = getDotEnv();

export const auth: RequestHandler = (req: Request, res: Response) => {
  const dtsgKey = getRandomFill(12);
  const dtsgKeyCipherText = encrypt({ dtsgKey });
  const dtsgValueCipherText = encrypt({ ts: Date.now() }, dtsgKey);

  res.send(
    renderPage(
      <Chrome>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.GOOGLE_CLIENT_ID="${dotenv.GOOGLE_CLIENT_ID}";
              window.DTSG_TOKEN="${dtsgKeyCipherText}${dtsgValueCipherText}";
            `,
          }}
        ></script>

        <div id="react-root">
          <Auth />
        </div>
        <script src="https://accounts.google.com/gsi/client"></script>
        <script src="/auth/hydrate.js"></script>
      </Chrome>,
    ),
  );
};
