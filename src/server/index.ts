import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';
import CookieParser from 'cookie-parser';
import path from 'path';

import getDotEnv from '../lib/dotenv';
import { confirmDBConnection } from '../lib/db/util';
import { authMiddleware } from './lib/authMiddleware';

// Routes
import { home } from './routes/home';
import { profile } from './routes/profile';
import { team } from './routes/team';
import { createTeam } from './routes/createTeam';
import { puzzles } from './routes/puzzles';
import {
  generatePuzzleInstance,
  getPuzzleInfo,
  listPuzzles,
} from './routes/api/puzzles';
import { puzzle } from './routes/puzzle';
import { auth } from './routes/auth';
import { logout } from './routes/logout';
import { staticResource } from './routes/staticResource';
import { googleOAuthRedirect } from './routes/googleOAuthRedirect';
import { saveProfile, checkUserNameIsAvailable } from './routes/api/profile';
import {
  checkTeamNameIsAvailable,
  createTeam as createTeamAPI,
  listTeamMembers,
  updateTeam as updateTeamAPI,
} from './routes/api/team';
import { initWebSockets } from './websockets/initWebSockets';
import { healthCheck } from './routes/healthCheck';
import { joinTeam } from './routes/joinTeam';
import { generateJoinCode } from './routes/api/joinCode';

const config = getDotEnv();

const app = express();

app.enable('trust proxy');

const router = express.Router();
app.use(express.json({ limit: '100kb' }));
app.use(CookieParser(config.COOKIE_PARSER_SECRET));
app.use('/', router);

console.log('Bootstrapping the server...');

(async () => {
  await confirmDBConnection();

  // Pages
  router.get('/', authMiddleware, home);
  router.get('/home', authMiddleware, home);
  router.get('/profile', authMiddleware, profile);
  router.get('/puzzles', authMiddleware, puzzles);
  router.get('/puzzle/:slug', authMiddleware, puzzle);
  router.get('/team', authMiddleware, team);
  router.get('/create-team', authMiddleware, createTeam);
  router.get('/join-team', authMiddleware, joinTeam);
  router.get('/auth', auth);
  router.get('/logout', logout);
  router.get('/google-oauth-redirect', googleOAuthRedirect);
  router.get('/health-check', healthCheck);

  // API endpoints
  router.post('/api/save-profile', authMiddleware, saveProfile);
  router.post(
    '/api/check-user-name-is-available',
    authMiddleware,
    checkUserNameIsAvailable,
  );

  router.post(
    '/api/check-team-name-is-available',
    authMiddleware,
    checkTeamNameIsAvailable,
  );

  router.post('/api/create-team', authMiddleware, createTeamAPI);
  router.post('/api/update-team', authMiddleware, updateTeamAPI);
  router.post('/api/list-puzzles', authMiddleware, listPuzzles);
  router.post('/api/puzzle-info', authMiddleware, getPuzzleInfo);
  router.post(
    '/api/generate-puzzle-instance',
    authMiddleware,
    generatePuzzleInstance,
  );
  router.post('/api/list-team-members', authMiddleware, listTeamMembers);
  router.post('/api/generate-join-code', authMiddleware, generateJoinCode);

  // Static resources
  router.get(/.*(\.js|\.js\.map)$/, staticResource);

  let server: https.Server | http.Server;
  if (config.HTTPS) {
    const privateKey = fs.readFileSync(
      path.resolve(
        './.' + config.SERVER_HOST + '/',
        config.SERVER_HOST + '.key',
      ),
    );
    const certificate = fs.readFileSync(
      path.resolve(
        './.' + config.SERVER_HOST + '/',
        config.SERVER_HOST + '.crt',
      ),
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
  initWebSockets(server);

  server.listen(parseInt(config.SERVER_PORT, 10), '0.0.0.0');
})();

export default {};
