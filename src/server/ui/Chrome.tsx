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
        <script
          dangerouslySetInnerHTML={{
            __html: `
          const rr = document.getElementById('react-root');
        `,
          }}
        ></script>
      </body>
    </html>
  );
};

export default Chrome;
