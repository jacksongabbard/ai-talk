import type { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

export const staticResource: RequestHandler = (req, res, next) => {
  if (!req.path.match(/(?:\.js|\.js\.map)$/)) {
    res.status(500);
    res.send('Bad request');
    return;
  }

  let match: RegExpMatchArray | null = req.path.match(
    /^\/static\/([a-zA-Z\-_]+)(\.js|\.js\.map)$/,
  );
  if (!match || match.length !== 3) {
    console.log('No match');
    res.status(500);
    res.send('Bad request');
    return;
  }

  const fileName = match[1];
  const fileExt = match[2].toLowerCase();

  const filePath = path.join(
    process.cwd(),
    'build/src/static/',
    fileName + fileExt,
  );

  try {
    const bytes = fs.readFileSync(filePath).toString();
    res.status(200);
    if (fileExt === '.js' || fileExt === '.js.map') {
      res.type('text/javascript');
    }
    res.send(bytes);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send('Bad hydration request');
    return;
  }
};
