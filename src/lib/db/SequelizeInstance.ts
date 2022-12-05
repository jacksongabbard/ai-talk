import { Sequelize } from 'sequelize-typescript';
import getDotEnv from '../dotenv';

import Team from './Team';

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

SequelizeInstance.addModels([Team]);

export default SequelizeInstance;
