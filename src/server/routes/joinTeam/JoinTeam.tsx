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
import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

const JoinTeam: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    appContext?.setShowNavigation(true);
    appContext?.setGlobalCordContext(false);
  }, [appContext?.setShowNavigation, appContext?.setGlobalCordContext]);

  const onJoinCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setJoinCode(e.target.value.trim());
    },
    [joinCode, setJoinCode],
  );

  const tryJoinCode = useCallback(() => {
    (async () => {
      const res = await callAPI('try-join-code', { joinCode });
      if (res && hasOwnProperty(res, 'success')) {
        window.location.pathname = '/team';
      }
    })();
  }, [joinCode]);

  // const navigate = useNavigate();

  return (
    <Page title="Join a team">
      <div>
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
            <Button
              variant="contained"
              disabled={joinCode.length !== 8}
              onClick={tryJoinCode}
            >
              Join!
            </Button>
          </>
        )}
      </div>
    </Page>
  );
};

export default JoinTeam;
