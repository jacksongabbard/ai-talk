import React, { useContext, useEffect } from 'react';
import { AppContext } from 'src/server/state/AppContext';
import ProfileForm from 'src/server/ui/profile/ProfileForm';
import Typography from '@mui/material/Typography';

const Profile: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  return (
    <>
      <Typography variant="h6">Team</Typography>
      {user && <ProfileForm />}
    </>
  );
};

export default Profile;
