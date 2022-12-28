import { useCallback, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type User from 'src/lib/db/User';
import callAPI from 'src/client/lib/callAPI';
import UserNameTextField from './UserNameTextField';

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const [editingProfile, _setEditingProfile] = useState(false);

  const [userName, setUserName] = useState(user.userName);
  const [location, setLocation] = useState(user.location);

  useEffect(() => {
    setUserName(user.userName);
    setLocation(user.location);
  }, [user, setUserName, setLocation]);

  const setEditingProfile = useCallback(() => {
    _setEditingProfile(true);
  }, [editingProfile]);

  const cancelEdit = useCallback(() => {
    setUserName(user.userName);
    setLocation(user.location);
    _setEditingProfile(false);
  }, [user, editingProfile, _setEditingProfile]);

  const save = useCallback(async () => {
    const resp = await callAPI('save-profile', {
      userID: user.id,
      userName,
      location,
    });

    console.log(resp);
  }, [user, userName, location]);

  const onUserNameChange = useCallback(
    (u: string) => {
      console.log({ u });
      setUserName(u);
    },
    [setUserName],
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
              label="Location"
              id="location"
              disabled={!editingProfile}
              fullWidth={true}
            />
          </div>
          <div>
            {editingProfile ? (
              <div>
                <Button onClick={save} variant="contained">
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
        </div>
      </Paper>
    </div>
  );
};

export default ProfileForm;
