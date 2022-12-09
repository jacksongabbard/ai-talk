import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Home from './Home';
import Chrome from 'src/server/ui/Chrome';

export const home: RequestHandler = (req: Request, res: Response) => {
  res.send(
    renderPage(
      <Chrome title="Foo">
        <div id="react-root">
          <Home />
        </div>
        <script src="/home/hydrate.js"></script>
      </Chrome>,
    ),
  );
};
