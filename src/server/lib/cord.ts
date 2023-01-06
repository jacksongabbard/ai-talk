import { getClientAuthToken } from '@cord-sdk/server';
import type Team from 'src/lib/db/Team';
import type User from 'src/lib/db/User';
import getDotEnv from 'src/lib/dotenv';

export function getCordClientToken(user: User, team?: Team): string {
  if (!team) {
    return '';
  }

  const config = getDotEnv();
  return getClientAuthToken(config.CORD_APPLICATION_ID, config.CORD_SECRET, {
    user_id: user.id,
    organization_id: team.id,
    user_details: {
      email: user.emailAddress,
      name: user.userName,
      profile_picture_url: user.profilePic,
    },
    organization_details: {
      name: team.teamName,
    },
  });
}
