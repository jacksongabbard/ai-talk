import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Auth from './Auth';
import Chrome from 'src/server/ui/Chrome';
import getDotEnv from 'src/lib/dotenv';
import { encrypt } from 'src/server/lib/crypto';

const dotenv = getDotEnv();

export const auth: RequestHandler = (req: Request, res: Response) => {
  const dtsgToken = encrypt({ ts: Date.now() });

  res.send(
    renderPage(
      <Chrome>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.GOOGLE_CLIENT_ID="${dotenv.GOOGLE_CLIENT_ID}";
              window.DTSG_TOKEN="${dtsgToken}";
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
