import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';
import Auth from './Auth';
import Chrome from 'src/server/ui/Chrome';
import getDotEnv from 'src/lib/dotenv';
import { makeDTSG } from 'src/server/lib/dtsg';
import { AppContextProvider } from 'src/server/state/AppContext';
import { makeAppStateFromRequest } from '../../lib/makeAppStateFromRequest';
import HydrationBilge from 'src/server/state/HydrationBilge';
import App from 'src/server/App';

const dotenv = getDotEnv();

export const auth: RequestHandler = async (req: Request, res: Response) => {
  const dtsgKey = await makeDTSG(req);
  const props = makeAppStateFromRequest(req);
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
          <AppContextProvider {...props}>
            <StaticRouter location={req.path}>
              <App />
            </StaticRouter>
          </AppContextProvider>
        </div>
        <script src="https://accounts.google.com/gsi/client"></script>
        <HydrationBilge props={props} />
      </Chrome>,
    ),
  );
};
