import React from 'react';

interface ChromeProps {
  children: React.ReactNode;
  title?: string;
}

const Chrome = ({ children, title }: ChromeProps): JSX.Element => {
  return (
    <html>
      <head>
        <title>{title || 'Puzzles'}</title>
      </head>
      <body>{children}</body>
    </html>
  );
};

export default Chrome;
