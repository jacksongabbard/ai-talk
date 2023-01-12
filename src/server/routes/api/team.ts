import type { Request, RequestHandler, Response } from 'express';
import { Op } from 'sequelize';

import Team from 'src/lib/db/Team';
import User from 'src/lib/db/User';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { bail400, error200 } from './util';
import ValidNameRegex from 'src/lib/validation/ValidNameRegex';
import SequelizeInstance from 'src/lib/db/SequelizeInstance';
import { isLikelyOffensive } from 'src/lib/moderation/bannedWords';
import type { ClientUser } from 'src/types/ClientUser';
import { userToClientUser } from 'src/types/ClientUser';
import { errorThingToString } from 'src/lib/error/errorThingToString';
import { teamToClientTeam } from 'src/types/ClientTeam';

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
      if (isLikelyOffensive(req.body.data.teamName)) {
        res.status(200);
        res.send(JSON.stringify({ available: false }));
        return;
      }

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
          req.body.data.teamName.length < 2 ||
          req.body.data.teamName.length > 48 ||
          !req.body.data.teamName.match(ValidNameRegex) ||
          isLikelyOffensive(req.body.data.teamName)
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
        team.set('location', req.body.data.location.trim());
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
          createdAt: team.createdAt.toISOString(),
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

export const updateTeam: RequestHandler = async (
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
      if (!req.context?.team) {
        throw new Error('User has no team');
      }

      const { team } = req.context;

      // Strictly speaking, this check is redundant, but I do imagine a world
      // with admin users one day so having some sort of explicity permissions
      // check seems wise.
      if (req.context.user.teamId !== team.id) {
        throw new Error('Permission denied');
      }

      const fields = {
        teamName: team.teamName,
        location: team.location,
        public: team.public,
      };
      if (
        hasOwnProperty(req.body.data, 'teamName') &&
        typeof req.body.data.teamName === 'string'
      ) {
        if (
          req.body.data.teamName.length < 2 ||
          req.body.data.teamName.length > 48 ||
          !req.body.data.teamName.match(ValidNameRegex) ||
          isLikelyOffensive(req.body.data.teamName)
        ) {
          throw new Error('Invalid team name');
        }
        fields.teamName = req.body.data.teamName;
      }

      if (
        hasOwnProperty(req.body.data, 'location') &&
        typeof req.body.data.location === 'string'
      ) {
        if (req.body.data.location.length > 48) {
          throw new Error('Invalid location');
        }
        fields.location = req.body.data.location.trim();
      }

      if (
        hasOwnProperty(req.body.data, 'public') &&
        typeof req.body.data.public === 'boolean'
      ) {
        fields.public = req.body.data.public;
      }

      await Team.update(fields, {
        where: {
          id: team.id,
        },
      });

      const { id, teamName, location } = team;
      res.status(200);
      res.send(
        JSON.stringify({
          success: true,
          id,
          createdAt: team.createdAt.toISOString(),
          ...fields,
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

export const listTeamMembers: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user) {
    bail400('Thou shalt not list team members, ya twat.', res);
    return;
  }

  if (
    req.body &&
    hasOwnProperty(req.body, 'data') &&
    typeof req.body.data === 'object' &&
    hasOwnProperty(req.body.data, 'teamId') &&
    typeof req.body.data.teamId === 'string'
  ) {
    let requesterTeamId = '';
    if (req.context?.team && req.context.team !== undefined) {
      requesterTeamId = req.context.team.id;
    }

    const team = await Team.findOne({
      where: {
        id: req.body.data.teamId,
      },
    });
    const isOwnTeam = team && requesterTeamId === team.id;
    if (!team) {
      bail400('No such team, my friend', res);
      return;
    }

    if (!team.public && !isOwnTeam) {
      error200('Team not public', res);
      return;
    }

    const users = await User.findAll({
      where: {
        teamId: team.id,
      },
    });

    const clientUsers: ClientUser[] = [];
    let privateUsersOmitted = false;
    for (let u of users) {
      if (u.public || isOwnTeam) {
        clientUsers.push(userToClientUser(u));
      } else {
        privateUsersOmitted = true;
      }
    }

    res.status(200);
    res.send({
      success: true,
      members: clientUsers,
      privateUsersOmitted,
    });
    return;
  } else {
    bail400('Bad input', res);
    return;
  }
};

export const listTeams: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.context?.user) {
      throw new Error('No user');
    }

    const teams = await Team.findAll({
      where: { public: true },
      order: [['team_name', 'ASC']],
    });
    const clientTeams = teams.map((t) => teamToClientTeam(t));
    res.status(200);
    res.send(JSON.stringify({ teams: clientTeams }));
  } catch (e) {
    bail400(errorThingToString(e), res);
    return;
  }
};
