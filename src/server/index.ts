import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';
import CookieParser from 'cookie-parser';
import path from 'path';

import getDotEnv from '../lib/dotenv';
import { confirmDBConnection } from '../lib/db/util';
import { home } from './routes/home';

const config = getDotEnv();

const app = express();
const router = express.Router();
app.use(express.json({ limit: '100kb' }));
app.use(CookieParser());
app.use('/', router);

console.log('Bootstrapping the server...');

(async () => {
  await confirmDBConnection();

  router.get('/', home);

  let server;
  if (config.SERVER_HOST === 'localhost') {
    const privateKey = fs.readFileSync(
      path.resolve('./.localhost/', 'localhost.key'),
    );
    const certificate = fs.readFileSync(
      path.resolve('./.localhost/', 'localhost.crt'),
    );
    server = https.createServer(
      {
        key: privateKey,
        cert: certificate,
      },
      app,
    );
  } else {
    server = http.createServer(app);
  }

  // initWebSockets(server);

  server.listen(parseInt(config.SERVER_PORT, 10), '0.0.0.0');
})();
