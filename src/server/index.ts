import fs from 'fs';
import https from 'https';

import express from 'express';
import CookieParser from 'cookie-parser';
import path from 'path';

import getDotEnv from '../lib/dotenv';
import { confirmDBConnection } from '../lib/db/util';
import { authMiddleware } from './lib/authMiddleware';

// Routes
import { home } from './routes/home';
import { auth } from './routes/auth';
import { hydrate } from './routes/hydrate';
import { staticResource } from './routes/staticResource';
import { googleOAuthRedirect } from './routes/googleOAuthRedirect';

const config = getDotEnv();

const app = express();

app.enable('trust proxy');

const router = express.Router();
app.use(express.json({ limit: '100kb' }));
app.use(CookieParser());
// app.use(authMiddleware);
app.use('/', router);

console.log('Bootstrapping the server...');

(async () => {
  await confirmDBConnection();

  router.get('/', home);
  router.get('/home', home);
  router.get('/auth', auth);
  router.get('/google-oauth-redirect', googleOAuthRedirect);
  router.get(/.*hydrate(\.js|\.js\.map)$/, hydrate);
  router.get(/.*(\.js|\.js\.map)$/, staticResource);

  let server;
  const privateKey = fs.readFileSync(
    path.resolve('./.' + config.SERVER_HOST + '/', config.SERVER_HOST + '.key'),
  );
  const certificate = fs.readFileSync(
    path.resolve('./.' + config.SERVER_HOST + '/', config.SERVER_HOST + '.crt'),
  );
  server = https.createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app,
  );

  // initWebSockets(server);

  server.listen(parseInt(config.SERVER_PORT, 10), '0.0.0.0');
})();

export default {};
