import React from 'react';
import type User from 'src/lib/db/User';

type ProfileFormProps = {
  user: User;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  return (
    <div>
      <pre>{JSON.stringify(user, null, 4)}</pre>
    </div>
  );
};

export default ProfileForm;
