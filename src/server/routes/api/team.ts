import type { Request, RequestHandler, Response } from 'express';
import { Op, Transaction } from 'sequelize';

import Team from 'src/lib/db/Team';
import User from 'src/lib/db/User';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { bail400 } from './util';
import ValidNameRegex from 'src/lib/validation/ValidNameRegex';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';

export const checkTeamNameIsAvailable: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (
      req.body &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object' &&
      hasOwnProperty(req.body.data, 'teamName') &&
      typeof req.body.data.teamName === 'string' &&
      req.body.data.teamName.length >= 2 && // enforced at the DB as well
      req.body.data.teamName.length <= 48 // enforced at the DB as well
    ) {
      const teamCount = await Team.count({
        where: {
          teamName: { [Op.iLike]: req.body.data.teamName },
        },
      });
      const available = teamCount === 0;

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

export const createTeam: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.context?.user) {
      throw new Error('No user');
    }

    if (
      req.query &&
      hasOwnProperty(req.body, 'data') &&
      typeof req.body.data === 'object'
    ) {
      if (req.context?.team) {
        throw new Error('User already has a team');
      }

      const team = Team.build({
        teamName: 'Team_' + Math.round(Math.random() * 10000).toString(),
        location: '',
      });

      if (
        hasOwnProperty(req.body.data, 'teamName') &&
        typeof req.body.data.teamName === 'string'
      ) {
        if (
          req.body.data.teamName.length < 2 &&
          req.body.data.teamName.length > 48 &&
          req.body.data.teamName.match(ValidNameRegex)
        ) {
          throw new Error('Invalid team name');
        }
        team.set('teamName', req.body.data.teamName);
      }

      if (
        hasOwnProperty(req.body.data, 'location') &&
        typeof req.body.data.location === 'string'
      ) {
        if (req.body.data.location.length > 48) {
          throw new Error('Invalid location');
        }
        team.set('location', req.body.data.location);
      }

      if (
        hasOwnProperty(req.body.data, 'public') &&
        typeof req.body.data.public === 'boolean'
      ) {
        team.set('public', req.body.data.public);
      }

      const t = await SequelizeInstance.transaction();
      try {
        await team.save({ transaction: t });
        await User.update(
          { teamId: team.id },
          { where: { id: req.context.user.id }, transaction: t },
        );
        await t.commit();
      } catch (e) {
        console.log(e);
        await t.rollback();
        throw new Error('Error creating team');
      }

      const { id, teamName, location } = team;
      res.status(200);
      res.send(
        JSON.stringify({
          success: true,
          id,
          teamName,
          location,
          public: team.public,
        }),
      );
      return;
    } else {
      bail400('Bad request', res);
      return;
    }
  } catch (e) {
    console.log('Failed to save profile: ', e);
    bail400('Unexpected error: ' + (e as Error).message, res);
    return;
  }
};
