import React from 'react';
import { StaticRouter } from 'react-router-dom/server';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Chrome from 'src/server/ui/Chrome';
import { makeAppStateFromRequest } from '../../lib/makeAppStateFromRequest';
import App from 'src/server/App';
import { AppContextProvider } from 'src/server/state/AppContext';
import HydrationBilge from 'src/server/state/HydrationBilge';

export const home: RequestHandler = (req: Request, res: Response) => {
  const props = makeAppStateFromRequest(req);
  res.send(
    renderPage(
      <Chrome title="Home">
        <div id="react-root">
          <AppContextProvider {...props}>
            <StaticRouter location={req.path}>
              <App />
            </StaticRouter>
          </AppContextProvider>
        </div>
        <HydrationBilge props={props} />
      </Chrome>,
    ),
  );
};
