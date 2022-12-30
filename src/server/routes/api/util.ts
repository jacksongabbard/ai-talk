import type { Response } from 'express';

export function bail400(errorMessage: string, res: Response) {
  res.status(400);
  res.send(JSON.stringify({ error: errorMessage }));
}

export function bail500(errorMessage: string, res: Response) {
  res.status(500);
  res.send(JSON.stringify({ error: errorMessage }));
}
