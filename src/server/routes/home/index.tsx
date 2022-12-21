import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Home from './Home';
import Chrome from 'src/server/ui/Chrome';
import { makeHomePropsFromRequest } from './HomeProps';

export const home: RequestHandler = (req: Request, res: Response) => {
  const props = makeHomePropsFromRequest(req);
  res.send(
    renderPage(
      <Chrome title="Foo">
        <div id="react-root">
          <Home {...props} />
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
