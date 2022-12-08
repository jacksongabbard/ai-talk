import React from 'react';

import type { Request, RequestHandler, Response } from 'express';

import { renderPage } from 'src/server/ui/util';

import Auth from './Auth';

export const auth: RequestHandler = (req: Request, res: Response) => {
  res.send(renderPage(<Auth />));
};
