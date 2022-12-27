import { useCallback, useState } from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type User from 'src/lib/db/User';
import callAPI from 'src/client/lib/callAPI';

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const [editingProfile, _setEditingProfile] = useState(false);
  const setEditingProfile = useCallback(() => {
    _setEditingProfile(true);
  }, [editingProfile]);

  const cancelEdit = useCallback(() => {
    _setEditingProfile(false);
  }, [user, editingProfile, _setEditingProfile]);

  const save = useCallback(async () => {
    await callAPI('save-profile', {
      foo: 'bar',
      // TODO: send the username and location
    });
  }, [user]);

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
            <TextField
              value={user.userName}
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
              value={user.location}
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
