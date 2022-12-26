import React from 'react';
import { StaticRouter } from 'react-router-dom/server';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Home from './Home';
import Chrome from 'src/server/ui/Chrome';
import { makeHomePropsFromRequest } from './HomeProps';
import App from 'src/server/App';

export const home: RequestHandler = (req: Request, res: Response) => {
  const props = makeHomePropsFromRequest(req);
  res.send(
    renderPage(
      <Chrome title="Home">
        <div id="react-root">
          <StaticRouter location={req.path}>
            <App />
          </StaticRouter>
        </div>
        <div
          id="hydration-bilge"
          data-hydration-state={JSON.stringify(props)}
        />
        <script src="/home/hydrate.js"></script>
      </Chrome>,
    ),
  );
};
