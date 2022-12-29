import React, { useCallback, useContext, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type User from 'src/lib/db/User';
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

  return (
    <div
      css={{
        maxWidth: '768px',
      }}
    >
      <Paper>
        <div
          css={{
            padding: 'var(--spacing-xlarge)',
          }}
        >
          <div
            css={{
              paddingBottom: 'var(--spacing-large)',
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
              paddingBottom: 'var(--spacing-large)',
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
          <div>
            {editingProfile ? (
              <div>
                <Button
                  onClick={save}
                  variant="contained"
                  disabled={
                    (userName === user.userName &&
                      location === user.location) ||
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
          {successMessage !== '' && (
            <Paper
              css={{
                background: 'var(--theme-sea)',
                padding: 'var(--spacing-medium)',
                marginTop: 'var(--spacing-medium)',
                marginBottom: 'var(--spacing-medium)',
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
                marginTop: 'var(--spacing-medium)',
                marginBottom: 'var(--spacing-medium)',
                color: '#fff',
              }}
            >
              {errorMessage}
            </Paper>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default ProfileForm;
