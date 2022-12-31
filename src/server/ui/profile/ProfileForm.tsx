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
import ValidNameRegex from 'src/lib/validation/ValidNameRegex';
import type { ClientUser } from 'src/types/ClientUser';
import MessageBox from '../messageBox/MessageBox';

type ProfileFormProps = {
  onUpdate: (user: ClientUser) => void;
  onCancel: () => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ onUpdate, onCancel }) => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const setUser = appContext?.setUser;

  if (!user || !setUser) {
    throw new Error('No user');
  }

  const [userName, setUserName] = useState(user.userName);
  const [location, setLocation] = useState(user.location);
  const [publicProfile, setPublicProfile] = useState(user.public);

  const [userNameIsValid, setUserNameIsValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUserName(user.userName);
    setLocation(user.location);
    setUserNameIsValid(true);
  }, [user, setUserName, setLocation, setUserNameIsValid]);

  const onValidityChange = useCallback(
    ({ valid }: { valid: boolean }) => {
      setUserNameIsValid(valid);
    },
    [setUserNameIsValid],
  );

  const cancelEdit = useCallback(() => {
    setSuccessMessage('');
    setErrorMessage('');
    setUserName(user.userName);
    setLocation(user.location);
    onCancel();
  }, [
    user,
    setSuccessMessage,
    setErrorMessage,
    setUserName,
    setLocation,
    onCancel,
  ]);

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

      const u = { ...user };
      setUser(u);
      onUpdate(u);
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
  ]);

  const onUserNameChange = useCallback(
    (u: string) => {
      setUserName(u);
    },
    [setUserName],
  );

  const onLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocation(e.target.value.substring(0, 48));
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
        <MessageBox type="success">{successMessage}</MessageBox>
      )}
      {errorMessage !== '' && (
        <MessageBox type="error">{errorMessage}</MessageBox>
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
          onValidityChange={onValidityChange}
          label="User Name"
          id="userName"
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
          fullWidth={true}
        />
      </div>
      <div
        css={{
          paddingBottom: 'var(--spacing-xlarge)',
          paddingTop: 'var(--spacing-large)',
        }}
      >
        <>
          <FormControlLabel
            control={
              <Checkbox checked={publicProfile} onChange={onPublicChange} />
            }
            label="Public"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox checked={!publicProfile} onChange={onPrivateChange} />
            }
            label="Private"
          />
          <Typography
            variant="subtitle2"
            css={{ marginBottom: 'var(--spacing-medium)' }}
          >
            Selecting <em>Public</em> allows your profile to be seen by people
            on this site. If you are a part of a team, your user name will also
            be listed as part of the team (if that team is itself public).
          </Typography>
          <Typography variant="subtitle2">
            Selecting <em>Private</em> means your profile will not be seen by
            people on this site. If you are a part of a team, your user name
            will still be shown to members of that team.
          </Typography>
        </>
      </div>
      <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div>
          <Button
            onClick={save}
            variant="contained"
            disabled={
              (userName === user.userName &&
                location === user.location &&
                publicProfile === user.public) ||
              !userNameIsValid ||
              !userName.match(ValidNameRegex) ||
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
      </div>
    </>
  );
};

export default ProfileForm;
