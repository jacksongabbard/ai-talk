import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Avatar, Button, Divider, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import { AppContext } from 'src/server/state/AppContext';
import ProfileForm from 'src/server/ui/profile/ProfileForm';
import Page from 'src/server/ui/page/Page';
import { ClientUser, hydrateSerializedClientUser } from 'src/types/ClientUser';
import { errorThingToString } from 'src/lib/error/errorThingToString';
import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import MessageBox from 'src/server/ui/messageBox/MessageBox';
import { hydrateSerializedClientTeam } from 'src/types/ClientTeam';

const Profile: React.FC = () => {
  const appContext = useContext(AppContext);
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState<string | undefined>();
  const [user, setUser] = useState<ClientUser | undefined>(
    params.userName ? undefined : appContext?.user,
  );
  const [team, setTeam] = useState(
    params.userName ? undefined : appContext?.team,
  );

  useEffect(() => {
    if (!user && !params.userName) {
      setErrorMessage('Soz, no user information to display!');
      return;
    }

    (async () => {
      if (!params.userName) {
        return;
      }

      try {
        const resp = await callAPI('get-user-id-for-user-name', {
          userName: params.userName,
        });
        if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
          setErrorMessage(resp.error);
          return;
        }

        if (hasOwnProperty(resp, 'userId') && typeof resp.userId === 'string') {
          setUserId(resp.userId);
          return;
        }

        throw new Error(
          "The server didn't give back a userId!? That's no way to carry on.",
        );
      } catch (e) {
        setErrorMessage(errorThingToString(e));
      }
    })();
  }, [user, params.userName, setErrorMessage, setUserId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const resp = await callAPI('get-user-by-id', { userId });
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        return;
      }

      try {
        if (hasOwnProperty(resp, 'user') && typeof resp.user === 'object') {
          const loadedUser = hydrateSerializedClientUser(resp.user);
          setUser(loadedUser);
        } else {
          throw new Error(
            "The server didn't give us back a valid user object. Womp womp.",
          );
        }
      } catch (e) {
        setErrorMessage(errorThingToString(e));
      }
    })();
  }, [userId, setUser, setTeam]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.teamId) {
      return;
    }

    (async () => {
      try {
        const resp = await callAPI('get-team-by-id', { teamId: user.teamId });
        if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
          setErrorMessage(resp.error);
          return;
        }

        if (hasOwnProperty(resp, 'team') && typeof resp.team === 'object') {
          const t = hydrateSerializedClientTeam(resp.team);
          setTeam(t);
        } else {
          throw new Error("Backend didn't give us back a team. Smdh.");
        }
      } catch (e) {
        setErrorMessage(errorThingToString(e));
      }
    })();
  }, [user, setTeam, setErrorMessage]);

  useEffect(() => {
    appContext?.setShowNavigation(true);
    appContext?.setCordContext('global');
  }, [appContext?.setShowNavigation, appContext?.setCordContext]);

  const [editingProfile, setEditingProfile] = useState(false);

  const startEditingProfile = useCallback(() => {
    setEditingProfile(true);
  }, [setEditingProfile]);

  const stopEditing = useCallback(() => {
    setEditingProfile(false);
  }, [setEditingProfile]);

  return (
    <Page title="Profile">
      <div css={{ flex: 1 }}>
        {errorMessage !== '' && (
          <MessageBox type="error">{errorMessage}</MessageBox>
        )}
        {editingProfile ? (
          <ProfileForm onUpdate={stopEditing} onCancel={stopEditing} />
        ) : (
          <>
            {user && (
              <>
                <div css={{ marginBottom: 'var(--spacing-large)' }}>
                  {user.profilePic ? (
                    <Avatar src={user.profilePic} />
                  ) : (
                    <Avatar>{user.userName[0].toUpperCase()}</Avatar>
                  )}
                </div>
                <div css={{ marginBottom: 'var(--spacing-large)' }}>
                  <Typography variant="overline">User Name</Typography>
                  <Typography variant="h5">{user.userName}</Typography>
                </div>
                {user.location && (
                  <div css={{ marginBottom: 'var(--spacing-large)' }}>
                    <Typography variant="overline">Location</Typography>
                    <Typography variant="body1">{user.location}</Typography>
                  </div>
                )}
                {team && (
                  <div css={{ marginBottom: 'var(--spacing-large)' }}>
                    <Typography variant="overline">Team</Typography>
                    <Typography variant="body1">
                      <Link to={'/team/' + team.teamName}>{team.teamName}</Link>
                    </Typography>
                  </div>
                )}
                <div css={{ marginBottom: 'var(--spacing-large)' }}>
                  <Typography variant="overline">Visibility</Typography>
                  <Typography variant="body1">
                    {user.public ? 'Public' : 'Private'}
                  </Typography>
                </div>
                <Divider />
                <div
                  css={{
                    marginBottom: 'var(--spacing-large)',
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  <Button variant="text" onClick={startEditingProfile}>
                    Edit profile
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Page>
  );
};

export default Profile;
