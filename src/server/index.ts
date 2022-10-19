import express from 'express';

import getDotEnv from '../lib/dotenv';

const config = getDotEnv();

console.log(config);

const app = express();
const router = express.Router();
app.use(express.json({ limit: '100kb' }));
