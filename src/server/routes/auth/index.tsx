import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Auth from './Auth';
import Chrome from 'src/server/ui/Chrome';

export const auth: RequestHandler = (req: Request, res: Response) => {
  res.send(
    renderPage(
      <Chrome>
        <Auth />
        <script src="https://accounts.google.com/gsi/client"></script>
        <script src="/auth/hydrate.js"></script>
      </Chrome>,
    ),
  );
};
