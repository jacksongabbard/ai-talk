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
      <body>
        <div id="react-root">{children}</div>
      </body>
    </html>
  );
};

export default Chrome;
