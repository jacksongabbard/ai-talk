import type { Request, RequestHandler, Response } from 'express';
import PageChunk from 'src/lib/db/PageChunk';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import dotenv from 'dotenv';

dotenv.config();

export const resetIndex: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (
    req.body &&
    typeof req.body === 'object' &&
    // Secret
    hasOwnProperty(req.body, 'secret') &&
    typeof req.body.secret === 'string' &&
    process.env.DATA_API_SECRET &&
    req.body.secret === process.env.DATA_API_SECRET &&
    // Index
    hasOwnProperty(req.body, 'index') &&
    typeof req.body.index === 'string'
  ) {
    const { index } = req.body;

    await PageChunk.destroy({
      where: {
        index,
      },
    });

    res.status(200);
    res.send({ success: true });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
