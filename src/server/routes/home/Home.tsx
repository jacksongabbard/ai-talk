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
    appContext?.setCordContext('team');
  }, [appContext?.setShowNavigation, appContext?.setCordContext]);

  return (
    <Page title="Home">
      <div>
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
        <p>I'll find something to put here.</p>
      </div>
    </Page>
  );
};

export default Home;
