import React, { useEffect } from 'react';
import type { HomeProps } from './HomeProps';
import Shell from 'src/server/ui/shell/Shell';

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
      <h2>Hi there {user ? user.userName : 'unknown puzzler'}</h2>
      <p>The party is just getting started</p>
    </>
  );
};

export default Home;
