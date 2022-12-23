import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Auth from './Auth';
import Chrome from 'src/server/ui/Chrome';
import getDotEnv from 'src/lib/dotenv';
import { makeDTSG } from 'src/server/lib/dtsg';

const dotenv = getDotEnv();

export const auth: RequestHandler = async (req: Request, res: Response) => {
  const dtsgKey = await makeDTSG(req);

  res.send(
    renderPage(
      <Chrome title="Login">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.GOOGLE_CLIENT_ID="${dotenv.GOOGLE_CLIENT_ID}";
              window.DTSG_TOKEN="${dtsgKey}";
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
