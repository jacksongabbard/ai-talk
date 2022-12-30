import React, { useContext, useEffect } from 'react';

import { AppContext } from 'src/server/state/AppContext';
import ProfileForm from 'src/server/ui/profile/ProfileForm';
import Page from 'src/server/ui/page/Page';

const Profile: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  return <Page title="Profile">{user && <ProfileForm />}</Page>;
};

export default Profile;
