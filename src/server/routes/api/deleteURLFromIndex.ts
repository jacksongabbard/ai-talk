import type { Request, RequestHandler, Response } from 'express';
import PageChunk from 'src/lib/db/PageChunk';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export const deleteURLFromIndex: RequestHandler = async (
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
    // URL
    hasOwnProperty(req.body, 'url') &&
    typeof req.body.url === 'string'
  ) {
    const { index, url } = req.body;

    console.log('Deleting embeddings for URL from index ' + index + ': ' + url);

    const count = await PageChunk.destroy({
      where: {
        index,
        url,
      },
    });

    res.status(200);
    res.send({ success: true, deletedCount: count });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
