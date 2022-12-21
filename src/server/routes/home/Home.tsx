import React, { useEffect } from 'react';
import type { HomeProps } from './HomeProps';

const Home: React.FC<HomeProps> = ({ user, team }) => {
  useEffect(() => {
    console.log('Omg, did this just work?!');
    console.log({ user, team });
  }, []);

  return (
    <>
      {user && user.profilePic && (
        <p>
          <img
            src={user.profilePic}
            alt={'Photo of ' + user.userName}
            width="100"
          />
        </p>
      )}
      <h1>Hi there {user ? user.userName : 'puzzler'}</h1>
      <p>The party is just getting started</p>
    </>
  );
};

export default Home;
