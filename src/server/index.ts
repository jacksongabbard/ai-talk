import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';
import CookieParser from 'cookie-parser';
import path from 'path';

import getDotEnv from '../lib/dotenv';

const config = getDotEnv();

console.log(config);

const app = express();
const router = express.Router();
app.use(express.json({ limit: '100kb' }));
