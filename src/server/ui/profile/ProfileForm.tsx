import { useCallback, useState } from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import type User from 'src/lib/db/User';

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const [editingProfile, _setEditingProfile] = useState(false);
  const setEditingProfile = useCallback(() => {
    _setEditingProfile(true);
  }, [editingProfile]);

  return (
    <div
      css={{
        maxWidth: '768px',
        margin: '0 auto',
      }}
    >
      <Paper square>
        <div
          css={{
            padding: 'var(--spacing-massive)',
          }}
        >
          <div className="phm pvl">
            <TextField
              value={user.userName}
              label="User Name"
              disabled={!editingProfile}
              fullWidth={true}
            />
          </div>
          <div className="phm pvl">
            <TextField
              value={user.location}
              label="Location"
              disabled={!editingProfile}
              fullWidth={true}
            />
          </div>
          <div>
            {editingProfile ? (
              <Button onClick={() => {}}>Save</Button>
            ) : (
              <Button variant="text" onClick={setEditingProfile}>
                Edit profile
              </Button>
            )}
          </div>
        </div>
      </Paper>
      <br />
      <pre>{JSON.stringify(user, null, 4)}</pre>
    </div>
  );
};

export default ProfileForm;