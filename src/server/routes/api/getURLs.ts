import type { Request, RequestHandler, Response } from 'express';
import URL from 'src/lib/db/URL';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

export const getURLs: RequestHandler = async (req: Request, res: Response) => {
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
    typeof req.body.index === 'string'
  ) {
    const { index } = req.body;

    console.log('Getting urls for index ' + index);

    const urls = await URL.findAll({
      where: {
        index,
      },
    });

    res.status(200);
    res.send({
      success: true,
      urls: urls.map((u) => ({
        url: u.url,
        lastScraped: u.lastScraped ? u.lastScraped.toISOString() : null,
      })),
    });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
