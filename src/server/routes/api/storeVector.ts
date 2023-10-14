import type { Request, RequestHandler, Response } from 'express';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import Vector from 'src/lib/db/Vector';

// Shhh don't tell.
const secret = 'sFgsg*W@_LqftXvvmWmkq4hjGsdDn@';

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
    typeof req.body.secret === 'string' &&
    req.body.secret === secret &&
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
      embedding,
    });

    res.status(200);
    res.send({ success: true });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
