import { StaticRouter } from 'react-router-dom/server';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Chrome from 'src/server/ui/Chrome';
import App from 'src/server/App';
import { AppContextProvider } from 'src/server/state/AppContext';
import { makeAppStateFromRequest } from '../../lib/makeAppStateFromRequest';
import HydrationBilge from 'src/server/state/HydrationBilge';

export const createTeam: RequestHandler = (req: Request, res: Response) => {
  const props = makeAppStateFromRequest(req);
  res.send(
    renderPage(
      <Chrome title="Create a team">
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
