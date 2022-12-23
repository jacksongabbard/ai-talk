import fs from 'fs';
import path from 'path';
import process from 'process';

const css = fs
  .readFileSync(
    path.join(process.cwd(), 'src', 'server', 'ui', 'css', 'chrome.css'),
  )
  .toString();

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
      <style type="text/css" dangerouslySetInnerHTML={{ __html: css }}></style>
      <body>{children}</body>
    </html>
  );
};

export default Chrome;
