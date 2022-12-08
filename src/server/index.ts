import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';
import CookieParser from 'cookie-parser';
import path from 'path';

import getDotEnv from '../lib/dotenv';
import { confirmDBConnection } from '../lib/db/util';
import { home } from './routes/home';
import { authMiddleware } from './lib/authMiddleware';
import { auth } from './routes/auth';

const config = getDotEnv();

const app = express();
const router = express.Router();
app.use(express.json({ limit: '100kb' }));
app.use(CookieParser());
app.use(authMiddleware);
app.use('/', router);

console.log('Bootstrapping the server...');

(async () => {
  await confirmDBConnection();

  router.get('/', home);
  router.get('/auth', auth);

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
