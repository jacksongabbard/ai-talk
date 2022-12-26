import React from 'react';
import { StaticRouter } from 'react-router-dom/server';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Profile from './Profile';
import Chrome from 'src/server/ui/Chrome';
import { makeProfilePropsFromRequest } from './ProfileProps';
import App from 'src/server/App';

export const profile: RequestHandler = (req: Request, res: Response) => {
  const props = makeProfilePropsFromRequest(req);
  res.send(
    renderPage(
      <Chrome title="Profile">
        <div id="react-root">
          <StaticRouter location={req.path}>
            <App />
          </StaticRouter>
        </div>
        <div
          id="hydration-bilge"
          data-hydration-state={JSON.stringify(props)}
        />
        <script src="/profile/hydrate.js"></script>
      </Chrome>,
    ),
  );
};
