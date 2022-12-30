import React, { useCallback, useContext, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import callAPI from 'src/client/lib/callAPI';
import UserNameTextField from './UserNameTextField';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { AppContext } from 'src/server/state/AppContext';

const ProfileForm: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const setUser = appContext?.setUser;

  if (!user || !setUser) {
    throw new Error('No user');
  }

  const [editingProfile, _setEditingProfile] = useState(false);

  const [userName, setUserName] = useState(user.userName);
  const [location, setLocation] = useState(user.location);
  const [publicProfile, setPublicProfile] = useState(user.public);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUserName(user.userName);
    setLocation(user.location);
  }, [user, setUserName, setLocation]);

  const setEditingProfile = useCallback(() => {
    _setEditingProfile(true);
  }, [editingProfile]);

  const cancelEdit = useCallback(() => {
    setSuccessMessage('');
    setErrorMessage('');
    setUserName(user.userName);
    setLocation(user.location);
    _setEditingProfile(false);
  }, [user, editingProfile, _setEditingProfile]);

  const save = useCallback(async () => {
    setSuccessMessage('');
    setErrorMessage('');

    const resp = await callAPI('save-profile', {
      userID: user.id,
      userName,
      location,
      public: publicProfile,
    });

    if (hasOwnProperty(resp, 'success') && typeof resp.success === 'boolean') {
      setSuccessMessage('Profile updated successfully!');
      _setEditingProfile(false);
      if (
        hasOwnProperty(resp, 'userName') &&
        typeof resp.userName === 'string'
      ) {
        user.userName = resp.userName;
      }
      if (
        hasOwnProperty(resp, 'location') &&
        typeof resp.location === 'string'
      ) {
        user.location = resp.location;
      }

      if (hasOwnProperty(resp, 'public') && typeof resp.public === 'boolean') {
        user.public = resp.public;
      }

      setUser({ ...user });
    }

    if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
      setSuccessMessage('Update failed: ' + resp.error);
    }
  }, [
    user,
    setUser,
    userName,
    location,
    publicProfile,
    setSuccessMessage,
    setErrorMessage,
    _setEditingProfile,
  ]);

  const onUserNameChange = useCallback(
    (u: string) => {
      setUserName(u);
    },
    [setUserName],
  );

  const onLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocation(e.target.value);
    },
    [setLocation],
  );

  const onPublicChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPublicProfile(true);
    },
    [setPublicProfile],
  );

  const onPrivateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPublicProfile(false);
    },
    [setPublicProfile],
  );

  return (
    <>
      {successMessage !== '' && (
        <Paper
          css={{
            background: 'var(--theme-sea)',
            padding: 'var(--spacing-medium)',
            paddingLeft: 'var(--spacing-large)',
            paddingRight: 'var(--spacing-large)',
            marginTop: 'var(--spacing-medium)',
            marginBottom: 'var(--spacing-massive)',
            color: '#fff',
          }}
        >
          {successMessage}
        </Paper>
      )}
      {errorMessage !== '' && (
        <Paper
          css={{
            background: 'var(--theme-orange)',
            padding: 'var(--spacing-medium)',
            paddingLeft: 'var(--spacing-large)',
            paddingRight: 'var(--spacing-large)',
            marginTop: 'var(--spacing-medium)',
            marginBottom: 'var(--spacing-massive)',
            color: '#fff',
          }}
        >
          {errorMessage}
        </Paper>
      )}
      <div
        css={{
          paddingTop: 'var(--spacing-large)',
          paddingBottom: 'var(--spacing-xlarge)',
        }}
      >
        <UserNameTextField
          actualUserName={user.userName}
          value={userName}
          onTextChange={onUserNameChange}
          label="User Name"
          id="userName"
          disabled={!editingProfile}
          fullWidth={true}
        />
      </div>
      <div
        css={{
          paddingBottom: 'var(--spacing-medium)',
          paddingTop: 'var(--spacing-large)',
        }}
      >
        <TextField
          value={location}
          onChange={onLocationChange}
          label="Location"
          id="location"
          disabled={!editingProfile}
          fullWidth={true}
        />
      </div>
      <div
        css={{
          paddingBottom: 'var(--spacing-xlarge)',
          paddingTop: 'var(--spacing-large)',
        }}
      >
        {!editingProfile && (
          <>
            <Typography variant="body1">
              Visibility <strong>{user.public ? 'Public' : 'Private'}</strong>
            </Typography>
          </>
        )}
        {editingProfile && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={publicProfile}
                  onChange={onPublicChange}
                  disabled={!editingProfile}
                />
              }
              label="Public"
            />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!publicProfile}
                  onChange={onPrivateChange}
                  disabled={!editingProfile}
                />
              }
              label="Private"
            />
            <>
              <Typography variant="subtitle2">
                Selecting <em>Public</em> allows your profile to be seen by
                people on this site. If you are a part of a team, your user name
                will also be listed as part of the team (if that team is itself
                public).
              </Typography>
              <Typography variant="subtitle2">
                Selecting <em>Private</em> means your profile will not be seen
                by people on this site. If you are a part of a team, your user
                name will still be shown to members of that team.
              </Typography>
            </>
          </>
        )}
      </div>
      <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
        {editingProfile ? (
          <div>
            <Button
              onClick={save}
              variant="contained"
              disabled={
                (userName === user.userName &&
                  location === user.location &&
                  publicProfile === user.public) ||
                errorMessage != ''
              }
            >
              Save
            </Button>
            <Button
              onClick={cancelEdit}
              css={{ marginLeft: 'var(--spacing-medium)' }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="text" onClick={setEditingProfile}>
            Edit profile
          </Button>
        )}
      </div>
    </>
  );
};

export default ProfileForm;
