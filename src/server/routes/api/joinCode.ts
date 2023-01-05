import type { Request, RequestHandler, Response } from 'express';

import { getRandomEntry } from 'src/lib/dict/utils';
import { bail400 } from './util';
import JoinCode from 'src/lib/db/JoinCode';

// Based on this: https://stackoverflow.com/a/27459196
const dict = 'H M N 3 4 P 6 7 R 9 T W C X Y F'.split(' ');

export const generateJoinCode: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user || !req.context.team) {
    bail400('No can do -- no user, no team, no join code.', res);
    return;
  }

  let code: string[] = [];
  for (let i = 0; i < 8; i++) {
    const entry = getRandomEntry(dict);
    code.push(entry);
  }

  const joinCode = JoinCode.build({
    teamId: req.context.team.id,
    userId: req.context.user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    code: code.join(''),
  });

  await joinCode.save();

  res.status(200);
  res.send({
    success: true,
    joinCode: joinCode.code,
  });
};
