import { Button, Typography } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { getRandomEntry } from 'src/lib/dict/utils';

import { AppContext } from 'src/server/state/AppContext';

declare var google: any;
declare var GOOGLE_CLIENT_ID: string;
declare var DTSG_TOKEN: string;

const prompts = [
  "I don't even know you!",
  'And who mayhaps are you?',
  "Let's see some ID there, buddy",
  'You. Shall Not. Pass. (Unless you login.)',
  'Stranger danger!',
  'Speak friend and enter. And by that I mean login already.',
];
const Auth: React.FC = () => {
  const appContext = useContext(AppContext);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    setPrompt(getRandomEntry(prompts));
  }, [setPrompt]);

  useEffect(() => {
    appContext?.setShowNavigation(false);
  }, [appContext?.setShowNavigation]);

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

  return (
    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>
      {prompt !== '' && (
        <div
          css={{
            margin: 'var(--spacing-large)',
          }}
        >
          <Typography variant="h5">{prompt}</Typography>
        </div>
      )}
      {doAuth && (
        <Button onClick={doAuth} size="large" variant="contained">
          Login with Google
        </Button>
      )}
    </div>
  );
};

export default Auth;
