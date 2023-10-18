import type { Request, RequestHandler, Response } from 'express';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export const getIndexes: RequestHandler = async (
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
    req.body.secret === process.env.DATA_API_SECRET
  ) {
    const [results] = await SequelizeInstance.query(
      `SELECT DISTINCT index FROM page_chunks`,
    );

    let indexes: string[] = [];
    if (results && Array.isArray(results)) {
      for (const thing of results) {
        if (
          thing &&
          typeof thing === 'object' &&
          'index' in thing &&
          typeof thing.index === 'string'
        ) {
          indexes.push(thing.index);
        }
      }
    }
    indexes.sort();

    res.status(200);
    res.send({ indexes });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
