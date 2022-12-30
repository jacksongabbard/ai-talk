import React, { useContext, useEffect } from 'react';
import Helmet from 'react-helmet';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';

const Home: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;

  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  return (
    <Page title="Home">
      {user && user.profilePic && (
        <p>
          <img
            src={user.profilePic}
            alt={'Photo of ' + user.userName}
            width="100"
          />
        </p>
      )}
      <h2 css={{ marginBottom: 'var(--spacing-large)' }}>
        Hi there {user ? user.userName : 'unknown puzzler'}
      </h2>
      <p>The party is just getting started</p>
    </Page>
  );
};

export default Home;
