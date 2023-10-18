import type { Request, RequestHandler, Response } from 'express';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import Vector from 'src/lib/db/Vector';

export const storeVector: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  console.log(req.body);

  if (
    req.body &&
    typeof req.body === 'object' &&
    // Secret
    hasOwnProperty(req.body, 'secret') &&
    process.env.DATA_API_SECRET &&
    typeof req.body.secret === 'string' &&
    req.body.secret === process.env.DATA_API_SECRET &&
    // Hash
    hasOwnProperty(req.body, 'hash') &&
    typeof req.body.hash === 'string' &&
    // Index
    hasOwnProperty(req.body, 'index') &&
    typeof req.body.index === 'string' &&
    // Embedding
    hasOwnProperty(req.body, 'embedding') &&
    Array.isArray(req.body.embedding)
  ) {
    const { hash, index, embedding } = req.body;
    await Vector.upsert({
      hash,
      index,
      embedding: JSON.stringify(embedding),
    });

    res.status(200);
    res.send({ success: true });
    return;
  }

  res.status(400);
  res.send({ error: 'bad request' });
};
