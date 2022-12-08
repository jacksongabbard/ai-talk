import { decrypt } from './crypto';
import User from 'src/lib/db/User';
import AuthToken from 'src/lib/db/AuthToken';
import type { RequestHandler, Request, Response, NextFunction } from 'express';
import Team from 'src/lib/db/Team';
import { nextTick } from 'process';

export async function authFromDatr(datr: string) {
  console.log(datr);
  if (!datr) {
    throw new Error('Request had no datr');
  }

  const datrData = (await decrypt(datr)) || {};
  if (!datrData || !datrData.tv) {
    throw new Error('Unidentified puzzler');
  }

  const session = await AuthToken.findOne({
    where: { tokenValue: datrData.tv },
    raw: true,
  });

  if (!session) {
    throw new Error('No session');
  }

  if (Date.now() > session.expiresAt.getTime()) {
    throw new Error('Expired session');
  }

  // Probably need to check more aspects of the auth token here

  const user = await User.findOne({
    where: { id: session.userId },
    raw: true,
  });

  if (!user) {
    console.log('Discovered a session for a non-existent user');
    throw new Error('No such user');
  }

  const team = await Team.findOne({
    where: { id: user.teamId },
    raw: true,
  });

  return { user, team };
}

function redirectIfNecessary(req: Request, res: Response, next: NextFunction) {
  // Only redirect if we're not already on the auth path
  if (req.path !== '/auth') {
    res.status(403);
    res.redirect('/auth');
  } else {
    next();
  }
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const { datr } = req.cookies;

  const { path, url } = req;
  let user;
  let team;
  try {
    const res = await authFromDatr(datr);
    user = res.user;
    team = res.team;
  } catch (e) {
    console.log(e);
    redirectIfNecessary(req, res, next);
    return;
  }

  if (!user) {
    redirectIfNecessary(req, res, next);
    return;
  }

  req.context = { ...req.context, user, team };

  next();
};
