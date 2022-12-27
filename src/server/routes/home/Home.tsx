import React, { useContext, useEffect } from 'react';
import { AppContext } from 'src/server/state/AppContext';

const Home: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;

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
