import type { RequestHandler } from 'express';

export const apiMiddleware: RequestHandler = async (_, res, next) => {
  res.type('application/json');
  next();
};
