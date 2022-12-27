import React, { useContext, useEffect } from 'react';
import { AppContext } from 'src/server/state/AppContext';
import ProfileForm from 'src/server/ui/profile/ProfileForm';

const Profile: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  useEffect(() => {
    console.log({ user, team });
  }, []);

  return <>{user && <ProfileForm user={user} />}</>;
};

export default Profile;
