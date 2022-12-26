import React, { useEffect } from 'react';
import type { ProfileProps } from './ProfileProps';
import Nav from 'src/server/ui/nav/Nav';
import ProfileForm from 'src/server/ui/profile/ProfileForm';
import Header from 'src/server/ui/header/Header';
import Shell from 'src/server/ui/shell/Shell';

const Profile: React.FC<ProfileProps> = ({ user, team }) => {
  useEffect(() => {
    console.log({ user, team });
  }, []);

  return <Shell title="Profile">{user && <ProfileForm user={user} />}</Shell>;
};

export default Profile;
