import { Sequelize } from 'sequelize-typescript';
import getDotEnv from '../dotenv';

import Team from './Team';
import User from './User';
import PuzzleInstance from './PuzzleInstance';
import PuzzleInstanceAction from './PuzzleInstanceAction';

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
    // logging: () => {},
    // logging: (...msg) => console.log(msg), // log everything
  },
);

SequelizeInstance.addModels([Team, User, PuzzleInstance, PuzzleInstanceAction]);

export default SequelizeInstance;
