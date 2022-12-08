import React from 'react';
import Chrome from 'src/server/ui/Chrome';

const Home: React.FC = () => {
  return (
    <Chrome title="Foo">
      <h1>ohai there</h1>
      <script type="module" src="/home/hydrate.js"></script>
    </Chrome>
  );
};

export default Home;
