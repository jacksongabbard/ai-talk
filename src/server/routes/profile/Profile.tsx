import React, { useEffect } from 'react';
import type { ProfileProps } from './ProfileProps';
import Nav from 'src/server/ui/nav/Nav';
import ProfileForm from 'src/server/ui/profile/ProfileForm';

const Profile: React.FC<ProfileProps> = ({ user, team }) => {
  useEffect(() => {
    console.log({ user, team });
  }, []);

  return (
    <>
      <h1>Profile</h1>
      {user && (
        <>
          {user.profilePic && (
            <p>
              <img
                src={user.profilePic}
                alt={'Photo of ' + user.userName}
                width="100"
              />
            </p>
          )}
          <h2>Hi there {user ? user.userName : 'unknown puzzler'}</h2>
          <ProfileForm user={user} />
        </>
      )}
      <Nav />
    </>
  );
};

export default Profile;
