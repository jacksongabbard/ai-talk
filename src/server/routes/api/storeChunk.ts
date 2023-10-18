import type { Request, RequestHandler, Response } from 'express';
import PageChunk from 'src/lib/db/PageChunk';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export const storeChunk: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  console.log(req.body);

  if (
    req.body &&
    typeof req.body === 'object' &&
    // Secret
    process.env.DATA_API_SECRET &&
    hasOwnProperty(req.body, 'secret') &&
    typeof req.body.secret === 'string' &&
    req.body.secret === process.env.DATA_API_SECRET &&
    // Hash
    hasOwnProperty(req.body, 'hash') &&
    typeof req.body.hash === 'string' &&
    // Index
    hasOwnProperty(req.body, 'index') &&
    typeof req.body.index === 'string' &&
    // Chunk
    hasOwnProperty(req.body, 'chunk') &&
    typeof req.body.chunk === 'string' &&
    // URL
    hasOwnProperty(req.body, 'url') &&
    typeof req.body.url === 'string' &&
    // Title
    hasOwnProperty(req.body, 'title') &&
    typeof req.body.title === 'string'
  ) {
    const { hash, index, chunk, url, title } = req.body;

    await PageChunk.upsert({
      hash,
      index,
      chunk,
      url,
      title,
    });

    res.status(200);
    res.send({ success: true });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
