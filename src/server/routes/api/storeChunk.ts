import type { Request, RequestHandler, Response } from 'express';
import PageChunk from 'src/lib/db/PageChunk';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export const storeChunk: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (
    req.body &&
    typeof req.body === 'object' &&
    // Secret
    process.env.DATA_API_SECRET &&
    hasOwnProperty(req.body, 'secret') &&
    typeof req.body.secret === 'string' &&
    req.body.secret === process.env.DATA_API_SECRET &&
    // Index
    hasOwnProperty(req.body, 'index') &&
    typeof req.body.index === 'string' &&
    // Chunk
    hasOwnProperty(req.body, 'chunk') &&
    typeof req.body.chunk === 'string' &&
    // Embedding
    hasOwnProperty(req.body, 'embedding') &&
    Array.isArray(req.body.embedding) &&
    // URL
    hasOwnProperty(req.body, 'url') &&
    typeof req.body.url === 'string' &&
    // Title
    hasOwnProperty(req.body, 'title') &&
    typeof req.body.title === 'string'
  ) {
    const { index, chunk, embedding, url, title } = req.body;

    console.log('Storing chunk for index ' + index + ': ' + chunk);

    await PageChunk.upsert({
      index,
      chunk,
      embedding: JSON.stringify(embedding),
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
