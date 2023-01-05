import type { Request, RequestHandler, Response } from 'express';

export const healthCheck: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  res.status(200);
  res.send("I aten't dead.");
};
