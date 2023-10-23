import type { Request, RequestHandler, Response } from 'express';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';
import PageChunk from 'src/lib/db/PageChunk';

export const search: RequestHandler = async (req: Request, res: Response) => {
  if (
    req.body &&
    typeof req.body === 'object' &&
    // Secret
    hasOwnProperty(req.body, 'secret') &&
    process.env.DATA_API_SECRET &&
    typeof req.body.secret === 'string' &&
    req.body.secret === process.env.DATA_API_SECRET &&
    // Index
    hasOwnProperty(req.body, 'index') &&
    typeof req.body.index === 'string' &&
    // Search
    hasOwnProperty(req.body, 'search') &&
    typeof req.body.search === 'string' &&
    // Embedding
    hasOwnProperty(req.body, 'embedding') &&
    Array.isArray(req.body.embedding)
  ) {
    const { index, embedding } = req.body;

    let actualIndexName = index;

    // This is probably shockingly inefficient. Also... cool story! We
    // can fix this a dozen different ways if any of this work comes to
    // matter.
    const [indexNames] = await SequelizeInstance.query(
      `SELECT index FROM page_chunks WHERE LOWER(index) = $1 LIMIT 1`,
      { bind: [index] },
    );
    if (
      Array.isArray(indexNames) &&
      indexNames.length &&
      typeof indexNames[0] === 'object' &&
      indexNames[0] &&
      'index' in indexNames[0] &&
      typeof indexNames[0].index === 'string'
    ) {
      actualIndexName = indexNames[0].index;
    } else {
      res.status(400);
      res.send({ error: 'No such index' + index });
      return;
    }

    const [results] = await SequelizeInstance.query(
      `SELECT title, url, chunk FROM page_chunks
      WHERE index = $2
      ORDER BY embedding <=> $1
      LIMIT 30`,
      {
        bind: [JSON.stringify(embedding), actualIndexName],
        plain: false,
      },
    );

    res.status(200);
    res.send(results);
    return;
  }

  res.status(400);
  res.send({ error: 'bad request' });
};
