import React, { useEffect } from 'react';

const Home: React.FC = () => {
  useEffect(() => {
    console.log('Omg, did this just work?!');
  }, []);

  return (
    <>
      <h1>Hi there puzzler</h1>
      <p>The party is just getting started</p>
    </>
  );
};

export default Home;
