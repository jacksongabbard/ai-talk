import { Button, Typography } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { getRandomEntry } from 'src/lib/dict/utils';

import { AppContext } from 'src/server/state/AppContext';
import DecoderRing from './DecoderRing';

declare let google: any;
declare let GOOGLE_CLIENT_ID: string;
declare let DTSG_TOKEN: string;

const Auth: React.FC = () => {
  const appContext = useContext(AppContext);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    appContext?.setShowNavigation(false);
    appContext?.setGlobalCordContext(false);
  }, [appContext?.setShowNavigation, appContext?.setGlobalCordContext]);

  // Where did I leave off?
  //
  // Need to fix up the scope to be the right thing (just email) and then add
  // the google-oauth-redirect end point to actually do the handshake.
  //
  // Also, the DTSG generation is super cheeseball. It's too easy to generate
  // instances of ciphertext, which makes it much easier to recover the key
  // through cryptanalysis. Need to change the way those values are generated.
  const doAuth = useCallback(() => {
    const { host } = window.location;
    const client = google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      ux_mode: 'redirect',
      redirect_uri: 'https://' + host + '/google-oauth-redirect',
      state: DTSG_TOKEN,
    });
    client.requestCode();
  }, []);

  const onSolve = useCallback(() => {
    setSolved(true);
  }, [setSolved]);

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div
        css={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: solved ? 'none' : 'inherit',
          opacity: solved ? 0 : 1,
          transition: 'opacity 1s',
        }}
      >
        <DecoderRing onSolve={onSolve} />
      </div>
      <div
        css={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          left: 0,
          opacity: solved ? 1 : 0,
          pointerEvents: solved ? 'inherit' : 'none',
          position: 'absolute',
          top: 0,
          transition: 'opacity 1s',
          width: '100%',
        }}
      >
        <Typography variant="h6" css={{ marginBottom: '24px' }}>
          Not too shabby. Go on then.
        </Typography>
        <Button onClick={doAuth} size="large" variant="contained">
          Login with Google
        </Button>
      </div>
    </div>
  );
};

export default Auth;
