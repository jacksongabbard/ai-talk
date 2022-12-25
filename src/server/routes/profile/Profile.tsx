import React, { useEffect } from 'react';
import type { ProfileProps } from './ProfileProps';
import Nav from 'src/server/ui/nav/Nav';
import ProfileForm from 'src/server/ui/profile/ProfileForm';
import Header from 'src/server/ui/header/Header';

const Profile: React.FC<ProfileProps> = ({ user, team }) => {
  useEffect(() => {
    console.log({ user, team });
  }, []);

  return (
    <>
      <Header title="Profile" user={user} team={team} />
      {user && <ProfileForm user={user} />}
      <Nav />
    </>
  );
};

export default Profile;
