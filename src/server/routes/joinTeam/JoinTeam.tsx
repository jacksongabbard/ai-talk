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
import MessageBox from 'src/server/ui/messageBox/MessageBox';

const JoinTeam: React.FC = () => {
  const appContext = useContext(AppContext);
  const user = appContext?.user;
  const team = appContext?.team;
  const [joinCode, setJoinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      const resp = await callAPI('try-join-code', { joinCode });
      if (hasOwnProperty(resp, 'error') && typeof resp.error === 'string') {
        setErrorMessage(resp.error);
        return;
      }

      if (resp && hasOwnProperty(resp, 'success')) {
        setErrorMessage('');
        window.location.pathname = '/team';
        return;
      }

      setErrorMessage(
        `I'm a very helpful error message, unlike the classic "something went wrong". [Comedic pause] ... NOT`,
      );
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
        {errorMessage !== '' && (
          <MessageBox type="error">{errorMessage}</MessageBox>
        )}
      </div>
    </Page>
  );
};

export default JoinTeam;
