import type { Request, RequestHandler, Response } from 'express';

export const googleOAuthRedirect: RequestHandler = (
  req: Request,
  res: Response,
) => {
  console.log(req.query);
  res.status(200);
};
