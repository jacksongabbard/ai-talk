import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Home from './Home';

export const home: RequestHandler = (req: Request, res: Response) => {
  res.send(renderPage(<Home />));
};
