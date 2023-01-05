import React, { useCallback, useContext, useEffect } from 'react';
import Helmet from 'react-helmet';

import { AppContext } from 'src/server/state/AppContext';

declare var google: any;
declare var GOOGLE_CLIENT_ID: string;
declare var DTSG_TOKEN: string;

const Auth: React.FC = () => {
  const appContext = useContext(AppContext);
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
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      {doAuth && <button onClick={doAuth}>Login with Google</button>}
    </>
  );
};

export default Auth;
