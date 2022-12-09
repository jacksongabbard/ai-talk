import React, { useEffect, useState } from 'react';

declare var google: any;

const Auth: React.FC = () => {
  const [doAuth, setDoAuth] = useState<(() => void) | undefined>(undefined);

  // Where did I leave off?
  //
  // I'd just figured out that my code is pretty risky because
  // I believe the output of getDotenv() can very easily get
  // compiled into the bundles used to hydrate React on
  // the client. So... that's scary.
  //
  // Related to that new problem, I was just about to wire up
  // the Google OAuth flow.

  useEffect(() => {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      ux_mode: 'redirect',
      redirect_uri: 'https://local.ohffs.io/code_callback_endpoint',
      state: 'YOUR_BINDING_VALUE',
    });
    console.log(client);
    setDoAuth(() => client.requestCode());
  }, [setDoAuth]);

  return (
    <>
      <h1>Login</h1>
      {doAuth && <button onClick={doAuth}>Login with Google</button>}
    </>
  );
};

export default Auth;
