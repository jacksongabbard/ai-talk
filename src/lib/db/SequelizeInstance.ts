import { Sequelize } from 'sequelize-typescript';
import getDotEnv from '../dotenv';

import Team from './Team';
import User from './User';
import PuzzleInstance from './PuzzleInstance';
import PuzzleInstanceAction from './PuzzleInstanceAction';
import AuthToken from './AuthToken';
import DTSGToken from './DTSGToken';
import PuzzleInstanceUser from './PuzzleInstanceUser';
import JoinCode from './JoinCode';
import PuzzleFeedback from 'src/lib/db/PuzzleFeedback';
import CordDotComEvent from 'src/lib/db/CordDotComEvent';
import PageChunk from 'src/lib/db/PageChunk';

const config = getDotEnv();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} = config;

const SequelizeInstance = new Sequelize(
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    dialect: 'postgres',
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT, 10),
    logging: () => {},
    // logging: (...msg) => console.log(JSON.stringify(msg, null, 4)), // log everything
  },
);

SequelizeInstance.addModels([
  Team,
  User,
  PuzzleInstance,
  PuzzleInstanceUser,
  PuzzleInstanceAction,
  AuthToken,
  DTSGToken,
  JoinCode,
  PuzzleFeedback,
  CordDotComEvent,
  PageChunk,
]);

export default SequelizeInstance;
