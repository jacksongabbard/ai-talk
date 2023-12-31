import type { Request, RequestHandler, Response } from 'express';

import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import User from 'src/lib/db/User';
import { Op } from 'sequelize';
import { bail400 } from './util';
import ValidNameRegex from 'src/lib/validation/ValidNameRegex';
import { isLikelyOffensive } from 'src/lib/moderation/bannedWords';

export const saveProfile: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (
      req.body &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object'
    ) {
      if (
        hasOwnProperty(req.body.data, 'userID') &&
        typeof req.body.data.userID === 'string'
      ) {
        if (req.body.data.userID !== req?.context?.user?.id) {
          throw new Error('Permission denied');
        }

        const user = await User.findOne({
          where: {
            id: req.body.data.userID,
          },
        });

        if (!user) {
          throw new Error('No such user');
        }

        if (
          hasOwnProperty(req.body.data, 'userName') &&
          typeof req.body.data.userName === 'string'
        ) {
          if (
            req.body.data.userName.length < 2 ||
            req.body.data.userName.length > 48 ||
            !req.body.data.userName.match(ValidNameRegex) ||
            isLikelyOffensive(req.body.data.userName)
          ) {
            throw new Error('Invalid user name');
          }
          user.set('userName', req.body.data.userName);
        }

        if (
          hasOwnProperty(req.body.data, 'location') &&
          typeof req.body.data.location === 'string'
        ) {
          if (req.body.data.location.length > 48) {
            throw new Error('Invalid location');
          }
          user.set('location', req.body.data.location.trim());
        }

        if (
          hasOwnProperty(req.body.data, 'public') &&
          typeof req.body.data.public === 'boolean'
        ) {
          user.set('public', req.body.data.public);
        }

        await user.save();

        const { id, userName, location } = user;
        res.status(200);
        res.send(
          JSON.stringify({
            success: true,
            id,
            userName,
            location,
            public: user.public,
          }),
        );
        return;
      } else {
        bail400('Bad request', res);
        return;
      }
    } else {
      bail400('Request contained no data', res);
      return;
    }
  } catch (e) {
    console.log('Failed to save profile: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};

export const checkUserNameIsAvailable: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (
      req.query &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object' &&
      hasOwnProperty(req.body.data, 'userName') &&
      typeof req.body.data.userName === 'string' &&
      req.body.data.userName.length >= 2 && // enforced at the DB as well
      req.body.data.userName.length <= 48 // enforced at the DB as well
    ) {
      if (isLikelyOffensive(req.body.data.userName)) {
        res.status(200);
        res.send(JSON.stringify({ available: false }));
        return;
      }

      const userCount = await User.count({
        where: {
          userName: { [Op.iLike]: req.body.data.userName },
        },
      });
      const available = userCount === 0;

      res.status(200);
      res.send(JSON.stringify({ available }));
      return;
    } else {
      bail400('Bad request', res);
      return;
    }
  } catch (e) {
    console.log('Failed to fetch count for username: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};
