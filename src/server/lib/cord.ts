import fetch from 'node-fetch';
import { Op } from 'sequelize';
import { getClientAuthToken, getServerAuthToken } from '@cord-sdk/server';
import Team from 'src/lib/db/Team';
import User from 'src/lib/db/User';
import getDotEnv from 'src/lib/dotenv';

export function getCordClientToken(user: User, team?: Team): string {
  const config = getDotEnv();
  return getClientAuthToken(config.CORD_APPLICATION_ID, config.CORD_SECRET, {
    user_id: user.id,
    organization_id: team ? team.id : 'everyone',
    user_details: {
      email: user.emailAddress,
      name: user.userName,
      profile_picture_url: user.profilePic,
    },
    organization_details: {
      name: team ? team.teamName : 'everyone',
    },
  });
}

const NOTIFICATIONS_ENDPOINT = 'https://api.cord.com/v1/notifications';
function sendNotification(
  actorId: string,
  recipientId: string,
  template: string,
  urlToRedirectTo: string,
) {
  if (!template.includes('{{actor}}')) {
    throw new Error('Missing actor. Damned Hollywood.');
  }

  const config = getDotEnv();
  const token = getServerAuthToken(
    config.CORD_APPLICATION_ID,
    config.CORD_SECRET,
  );

  fetch(NOTIFICATIONS_ENDPOINT, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      actor_id: actorId,
      recipient_id: recipientId,
      template: template,
      url: urlToRedirectTo,
      type: 'url',
    }),
  });
}

export async function sendNotificationToTeam(
  actorId: string,
  teamId: string,
  template: string,
  urlToRedirectTo: string,
) {
  if (!template.includes('{{actor}}')) {
    throw new Error('Missing actor. Damned Hollywood.');
  }

  const team = await Team.findOne({
    where: {
      id: teamId,
    },
  });
  const isOwnTeam = team && teamId === team.id;
  if (!isOwnTeam) {
    throw new Error(
      `Cannot send notifications to a team the actor doesn't belong to.`,
    );
  }

  const users = await User.findAll({
    where: {
      teamId: team.id,
      id: { [Op.ne]: actorId },
    },
  });

  for (const user of users) {
    sendNotification(actorId, user.id, template, urlToRedirectTo);
  }
}
