import React, { useContext, useEffect } from 'react';
import Helmet from 'react-helmet';
import Typography from '@mui/material/Typography';

import { AppContext } from 'src/server/state/AppContext';
import ProfileForm from 'src/server/ui/profile/ProfileForm';

const Profile: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Typography variant="h6">Team</Typography>
      {user && <ProfileForm />}
    </>
  );
};

export default Profile;
