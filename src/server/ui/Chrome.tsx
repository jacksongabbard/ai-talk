import e from 'express';
import React from 'react';
import type { ContainerProps } from './type';

const Chrome: React.FC<ContainerProps> = ({ children }) => {
  return (
    <html>
      <head>
        <title>Puzzles</title>
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
};

export default Chrome;
