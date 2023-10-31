import type { Request, RequestHandler, Response } from 'express';
import { v4 as uuid } from 'uuid';
import CordDotComEvent from 'src/lib/db/CordDotComEvent';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

// Shhh don't tell.
const secret = 'ylb3gpekbz5i0e3gpbz45mf0fg28r';

export const getEvents: RequestHandler = async (
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
    // Session ID
    hasOwnProperty(req.body, 'session_id') &&
    typeof req.body.session_id === 'string'
  ) {
    const { session_id } = req.body;

    const events = await CordDotComEvent.findAll({
      where: {
        sessionID: session_id,
      },
      order: [['created_at', 'desc']],
    });
    res.status(200);
    res.send({ events });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
