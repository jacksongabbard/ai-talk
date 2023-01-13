import React, { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';
import { Button } from '@mui/material';
import useRouterLink from 'src/server/ui/routerLink/useRouterLink';
import TeamForm from 'src/server/ui/team/TeamForm';

const CreateTeam: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  useEffect(() => {
    appContext?.setShowNavigation(true);

    appContext?.setGlobalCordContext(false);
  }, [appContext?.setShowNavigation, appContext?.setGlobalCordContext]);

  const navigate = useNavigate();
  const goBack = useCallback(() => {
    navigate('/team', { replace: true });
  }, [navigate]);

  const LeaveLink = useRouterLink('/leave-team');
  return (
    <Page title="Create a team">
      {team && (
        <>
          <Typography variant="h5">
            Whoopsie! You've already got a team!
          </Typography>
          <Typography variant="body2">
            Would you like to leave your current team?
          </Typography>
          <Button component={LeaveLink}>Leave existing team</Button>
        </>
      )}

      {!team && <TeamForm onUpdate={goBack} onCancel={goBack} />}
    </Page>
  );
};

export default CreateTeam;
