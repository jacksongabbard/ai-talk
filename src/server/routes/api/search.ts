import type { Request, RequestHandler, Response } from 'express';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import Vector from 'src/lib/db/Vector';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';

export const search: RequestHandler = async (req: Request, res: Response) => {
  console.log(req.body);

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
    // Embedding
    hasOwnProperty(req.body, 'embedding') &&
    Array.isArray(req.body.embedding)
  ) {
    const { index, embedding } = req.body;
    const [results] = await SequelizeInstance.query(
      `SELECT * FROM vectors
      ORDER BY embedding <=> $1
      WHERE index = $2
      LIMIT 10`,
      {
        bind: [embedding, index],
        model: Vector,
        mapToModel: true, // pass true here if you have any mapped fields
      },
    );

    console.log(results);

    res.status(200);
    res.send({ success: true });
    return;
  }

  res.status(400);
  res.send({ error: 'bad request' });
};
