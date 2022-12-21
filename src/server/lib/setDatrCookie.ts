import { v4 as uuid } from 'uuid';
import type { Request, Response } from 'express';

import AuthToken from 'src/lib/db/AuthToken';
import type User from 'src/lib/db/User';
import getRandomFill from './getRandomFill';

async function setDatrCookie(user: User, req: Request, res: Response) {
  let tokenValue: string;
  let id: string;

  const { datr } = req.cookies;
  if (!datr) {
    id = uuid();
    tokenValue = getRandomFill(12);
  } else {
    const session = await AuthToken.findOne({
      where: { tokenValue: datr },
      raw: true,
    });
    if (!session) {
      id = uuid();
      tokenValue = getRandomFill(12);
    } else if (session.userId === user.id) {
      id = session.id;
      tokenValue = datr;
    } else {
      res.status(401);
      throw new Error(
        'datr from user ' + session.userId + ' used by user ' + user.id,
      );
    }
  }

  const ms = 1000 * 60 * 60 * 24 * 7;
  await AuthToken.upsert({
    id,
    expiresAt: new Date(Date.now() + ms),
    tokenValue,
    userId: user.id,
  });

  res.cookie('datr', tokenValue, {
    maxAge: ms,
    signed: true,
    httpOnly: true,
  });
}

export default setDatrCookie;
