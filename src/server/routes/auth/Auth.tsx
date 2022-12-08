import React from 'react';
import Chrome from 'src/server/ui/Chrome';

const Auth: React.FC = () => {
  return (
    <Chrome title="Foo">
      <h1>Login</h1>
      <script src="https://accounts.google.com/gsi/client"></script>
    </Chrome>
  );
};

export default Auth;
