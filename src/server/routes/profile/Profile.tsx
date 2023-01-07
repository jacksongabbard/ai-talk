import React, { useCallback, useContext, useEffect, useState } from 'react';

import { AppContext } from 'src/server/state/AppContext';
import ProfileForm from 'src/server/ui/profile/ProfileForm';
import Page from 'src/server/ui/page/Page';
import { Avatar, Button, Divider, Typography } from '@mui/material';

const Profile: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  const [editingProfile, setEditingProfile] = useState(false);

  const startEditingProfile = useCallback(() => {
    setEditingProfile(true);
  }, [setEditingProfile]);

  const stopEditing = useCallback(() => {
    setEditingProfile(false);
  }, [setEditingProfile]);

  if (!user) {
    throw new Error('No user');
  }

  return (
    <Page title="Profile">
      <div>
        {editingProfile ? (
          <ProfileForm onUpdate={stopEditing} onCancel={stopEditing} />
        ) : (
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
                <Typography variant="body1">{team.teamName}</Typography>
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
      </div>
    </Page>
  );
};

export default Profile;
