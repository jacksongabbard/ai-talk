import React, { useEffect } from 'react';

const Home: React.FC = () => {
  useEffect(() => {
    console.log('Omg, did this just work?!');
  }, []);

  return (
    <>
      <h1>ohai there</h1>
      <script src="/home/hydrate.js"></script>
    </>
  );
};

export default Home;
