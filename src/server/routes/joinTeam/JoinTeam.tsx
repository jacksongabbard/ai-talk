import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import { AppContext } from 'src/server/state/AppContext';
import Page from 'src/server/ui/page/Page';
import { Button, Input } from '@mui/material';
import useRouterLink from 'src/server/ui/routerLink/useRouterLink';

const JoinTeam: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    appContext?.setShowNavigation(true);
  }, [appContext?.setShowNavigation]);

  const onJoinCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setJoinCode(e.target.value.trim());
    },
    [joinCode, setJoinCode],
  );

  const navigate = useNavigate();
  const goBack = useCallback(() => {
    navigate('/team', { replace: true });
  }, [navigate]);

  const LeaveLink = useRouterLink('/leave-team');
  return (
    <Page title="Join a team">
      {team && (
        <>
          <Typography variant="h5">
            Whoopsie! You've already got a team!
          </Typography>
        </>
      )}

      {!team && (
        <>
          <Typography variant="h5">Enter the join code for a team</Typography>
          <div css={{ marginBottom: 'var(--spacing-large)' }}>
            <Input
              css={{ fontSize: '5vw', width: '50vw' }}
              value={joinCode}
              onChange={onJoinCodeChange}
              placeholder="XXXXXXXX"
            />
          </div>
          <Button variant="contained">Join!</Button>
        </>
      )}
    </Page>
  );
};

export default JoinTeam;
