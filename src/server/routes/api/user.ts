import type { Request, RequestHandler, Response } from 'express';
import { bail400, error200 } from './util';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import User from 'src/lib/db/User';
import { userToClientUser } from 'src/types/ClientUser';

export const getUserIdFromUserName: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user) {
    bail400('Thou shalt not, ya twat.', res);
    return;
  }

  if (
    req.body &&
    hasOwnProperty(req.body, 'data') &&
    typeof req.body.data === 'object' &&
    hasOwnProperty(req.body.data, 'userName') &&
    typeof req.body.data.userName === 'string'
  ) {
    let requesterUserId = '';
    if (req.context?.user && req.context.user !== undefined) {
      requesterUserId = req.context.user.id;
    }

    const user = await User.findOne({
      where: {
        userName: req.body.data.userName,
      },
    });
    if (!user) {
      bail400('No such user, my friend', res);
      return;
    }

    const isSelf = user && requesterUserId === user.id;
    if (!user.public && !isSelf) {
      error200('User not public', res);
      return;
    }

    res.status(200);
    res.send(JSON.stringify({ userId: user.id }));
    return;
  }

  bail400('Bad input', res);
};

export const getUserById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user) {
    bail400('Thou shalt not, ya twat.', res);
    return;
  }

  if (
    req.body &&
    hasOwnProperty(req.body, 'data') &&
    typeof req.body.data === 'object' &&
    hasOwnProperty(req.body.data, 'userId') &&
    typeof req.body.data.userId === 'string'
  ) {
    let requesterUserId = '';
    if (req.context?.user && req.context.user !== undefined) {
      requesterUserId = req.context.user.id;
    }

    const user = await User.findOne({
      where: {
        id: req.body.data.userId,
      },
    });
    if (!user) {
      bail400('No such user, my friend', res);
      return;
    }

    const isSelf = user && requesterUserId === user.id;
    if (!user.public && !isSelf) {
      error200('User not public', res);
      return;
    }

    res.status(200);
    res.send(JSON.stringify({ user: userToClientUser(user) }));
    return;
  }

  bail400('Bad input', res);
};
