import type { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

import getDotEnv from 'src/lib/dotenv';

const hydrate: RequestHandler = (req, res, next) => {
  if (!req.path.includes('hydrate.js')) {
    res.status(500);
    res.send('Bad hydration request');
    return;
  }

  console.log(req.path);
  let match: RegExpMatchArray | null = req.path.match(
    /^\/([a-zA-Z\-]+)\/hydrate(\.js|\.js\.map)$/,
  );
  if (!match || match.length < 3) {
    console.log('No match');
    res.status(500);
    res.send('Bad hydration request');
    return;
  }

  const route = match[1];
  const fileExt = match[2];

  const config = getDotEnv();
  const filePath = path.join(
    process.cwd(),
    config.BUILD_DIR,
    'src/server/routes/',
    route,
    'hydrate' + fileExt,
  );

  try {
    const bytes = fs.readFileSync(filePath).toString();
    res.status(200);
    res.type('text/javascript');
    res.send(bytes);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('Bad hydration request');
    return;
  }
};

export default hydrate;
