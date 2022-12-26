import React, { useCallback } from 'react';
import Shell from 'src/server/ui/shell/Shell';

declare var google: any;
declare var GOOGLE_CLIENT_ID: string;
declare var DTSG_TOKEN: string;

const Auth: React.FC = () => {
  // Where did I leave off?
  //
  // Need to fix up the scope to be the right thing (just email) and then add
  // the google-oauth-redirect end point to actually do the handshake.
  //
  // Also, the DTSG generation is super cheeseball. It's too easy to generate
  // instances of ciphertext, which makes it much easier to recover the key
  // through cryptanalysis. Need to change the way those values are generated.
  const doAuth = useCallback(() => {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      ux_mode: 'redirect',
      redirect_uri: 'https://local.ohffs.io:8197/google-oauth-redirect',
      state: DTSG_TOKEN,
    });
    client.requestCode();
  }, []);

  return (
    <Shell title="Login" showNavigation={false}>
      {doAuth && <button onClick={doAuth}>Login with Google</button>}
    </Shell>
  );
};

export default Auth;
