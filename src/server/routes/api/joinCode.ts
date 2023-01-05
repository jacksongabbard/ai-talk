import type { Request, RequestHandler, Response } from 'express';

import { getRandomEntry } from 'src/lib/dict/utils';
import { bail400 } from './util';
import JoinCode from 'src/lib/db/JoinCode';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import Team from 'src/lib/db/Team';
import User from 'src/lib/db/User';

// Based on this: https://stackoverflow.com/a/27459196
const dict = 'H M N 3 4 P 6 7 R 9 T W C X Y F'.split(' ');
const JOIN_CODE_LENGTH = 8;
export const generateJoinCode: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user || !req.context.team) {
    bail400('No can do -- no user, no team, no join code.', res);
    return;
  }

  let code: string[] = [];
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
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

export const tryJoinCode: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  if (!req.context?.user) {
    bail400('No user for request', res);
    return;
  }

  if (req.context.team) {
    bail400('User already has a team', res);
    return;
  }

  if (
    req.body &&
    hasOwnProperty(req.body, 'data') &&
    typeof req.body.data === 'object' &&
    hasOwnProperty(req.body.data, 'joinCode') &&
    typeof req.body.data.joinCode === 'string'
  ) {
    const { joinCode } = req.body.data;

    if (joinCode.length !== JOIN_CODE_LENGTH) {
      bail400('Bad join code, homey', res);
      return;
    }

    const joinCodeInstance = await JoinCode.findOne({
      where: {
        code: joinCode,
      },
    });

    if (!joinCodeInstance) {
      bail400('No such join code -- are you high?', res);
      return;
    }

    if (new Date().getTime() > joinCodeInstance.expiresAt.getTime()) {
      bail400('Join code expired', res);
      return;
    }

    const team = await Team.findOne({
      where: {
        id: joinCodeInstance.teamId,
      },
    });

    if (!team) {
      bail400('Team for join code no longer exists -- if it ever did...', res);
      return;
    }

    const memberCount = await User.count({
      where: {
        teamId: team.id,
      },
    });

    if (memberCount >= 6) {
      bail400('Sorry mate, that team is full up', res);
      return;
    }

    const result = await User.update(
      { teamId: team.id },
      { where: { id: req.context.user.id } },
    );

    if (!result.length || result[0] !== 1) {
      bail400("Failed to add you to the team. I'm sorry.", res);
      return;
    }

    res.status(200);
    res.send({
      success: true,
    });

    const deleteResult = await JoinCode.destroy({
      where: {
        code: joinCode,
      },
    });
    if (deleteResult !== 1) {
      console.log('could-not-delete-join-code');
    }
  } else {
    bail400('Bad input', res);
    return;
  }
};
