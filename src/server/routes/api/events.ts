import type { Request, RequestHandler, Response } from 'express';
import { v4 as uuid } from 'uuid';
import CordDotComEvent from 'src/lib/db/CordDotComEvent';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

// Shhh don't tell.
const secret = 'ylb3gpekbz5i0e3gpbz45mf0fg28r';

export const logEvent: RequestHandler = async (req: Request, res: Response) => {
  console.log(req.body);

  if (
    req.body &&
    hasOwnProperty(req.body, 'data') &&
    typeof req.body.data === 'object' &&
    // Secret
    hasOwnProperty(req.body.data, 'secret') &&
    typeof req.body.data.secret === 'string' &&
    req.body.data.secret === secret &&
    // Session ID
    hasOwnProperty(req.body.data, 'sessid') &&
    typeof req.body.data.session_id === 'string' &&
    // Event Type
    hasOwnProperty(req.body.data, 'event_type') &&
    typeof req.body.data.event_type === 'string' &&
    // Current Page
    hasOwnProperty(req.body.data, 'current_page') &&
    typeof req.body.data.current_page === 'string' &&
    // User Agent
    hasOwnProperty(req.body.data, 'user_agent') &&
    typeof req.body.data.user_agent === 'string' &&
    // IP
    hasOwnProperty(req.body.data, 'ip') &&
    typeof req.body.data.ip === 'string' &&
    // City
    hasOwnProperty(req.body.data, 'ip_city') &&
    typeof req.body.data.ip_city === 'string' &&
    // Region
    hasOwnProperty(req.body.data, 'ip_region') &&
    typeof req.body.data.ip_region === 'string' &&
    // Country
    hasOwnProperty(req.body.data, 'ip_country') &&
    typeof req.body.data.ip_country === 'string' &&
    // Payload
    hasOwnProperty(req.body.data, 'payload') &&
    typeof req.body.data.payload === 'object'
  ) {
    const {
      session_id,
      event_type,
      ip,
      ip_city,
      ip_region,
      ip_country,
      payload,
    } = req.body.data;

    await CordDotComEvent.create({
      id: uuid(),
      sessionID: session_id,
      eventType: event_type,
      ip,
      ipCity: ip_city,
      ipRegion: ip_region,
      ipCountry: ip_country,
      payload,
    });
    res.status(200);
    res.send({ success: true });
    return;
  }

  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
