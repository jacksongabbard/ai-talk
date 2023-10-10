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
    typeof req.body === 'object' &&
    // Secret
    hasOwnProperty(req.body, 'secret') &&
    typeof req.body.secret === 'string' &&
    req.body.secret === secret &&
    // Session ID
    hasOwnProperty(req.body, 'session_id') &&
    typeof req.body.session_id === 'string' &&
    // Event Type
    hasOwnProperty(req.body, 'event_type') &&
    typeof req.body.event_type === 'string' &&
    // Current Page
    hasOwnProperty(req.body, 'current_page') &&
    typeof req.body.current_page === 'string' &&
    // User Agent
    hasOwnProperty(req.body, 'user_agent') &&
    typeof req.body.user_agent === 'string' &&
    // IP
    hasOwnProperty(req.body, 'ip') &&
    typeof req.body.ip === 'string' &&
    // City
    hasOwnProperty(req.body, 'ip_city') &&
    typeof req.body.ip_city === 'string' &&
    // Region
    hasOwnProperty(req.body, 'ip_region') &&
    typeof req.body.ip_region === 'string' &&
    // Country
    hasOwnProperty(req.body, 'ip_country') &&
    typeof req.body.ip_country === 'string' &&
    // Payload
    hasOwnProperty(req.body, 'payload') &&
    typeof req.body.payload === 'object'
  ) {
    const {
      session_id,
      event_type,
      current_page,
      ip,
      ip_city,
      ip_region,
      ip_country,
      payload,
    } = req.body;

    await CordDotComEvent.create({
      id: uuid(),
      sessionID: session_id,
      eventType: event_type,
      createdAt: new Date(),
      currentPage: current_page,
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

  console.log('Not logging');
  res.status(204);
  res.send({ 'no-op': 'no-op' });
};
