import fs from 'fs';
import path from 'path';
import process from 'process';
import getDotEnv from 'src/lib/dotenv';

const env = getDotEnv();

const host =
  'https://' +
  env.SERVER_HOST +
  (env.SERVER_HOST.includes('local') ? ':' + env.SERVER_PORT : '');

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={host} />
        <meta
          property="og:image"
          content={`${host}/static/images/ohffs.io.png`}
        />
        <meta
          property="og:image:alt"
          content="Concentric circles of some unknowable purpose"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:height" content="1262" />
        <meta property="og:image:width" content="1296" />
        <meta
          property="og:description"
          content="Devilish puzzles to delight and infuratiate. Real-time, multiplayer."
        />
      </head>
      <style type="text/css" dangerouslySetInnerHTML={{ __html: css }}></style>
      <body>{children}</body>
    </html>
  );
};

export default Chrome;
