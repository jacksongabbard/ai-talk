import React from 'react';

import TextField from '@mui/material/TextField';

import type User from 'src/lib/db/User';

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  return (
    <div>
      <pre>{JSON.stringify(user, null, 4)}</pre>
      <TextField value={user.userName} label="User Name" />
    </div>
  );
};

export default ProfileForm;
