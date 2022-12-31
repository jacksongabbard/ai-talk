import React, { useContext, useEffect } from 'react';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';

const Puzzles: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;

  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  return (
    <Page title="Puzzles">
      <p>Puzzles go here</p>
    </Page>
  );
};

export default Puzzles;
