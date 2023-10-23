// This is an intentionally relative path. Scripts don't enjoy the same
// support for `import` statements that our transpiled codebases do.
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

module.exports = {
  // The default environment is development, but since we pass around DB
  // config in a .env file specific to each environment, it's all the
  // same to us here. It does feel icky to have the same settings for
  // dev and prod, but this is an artifact of sequelize being too rigid.
  development: {
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: true,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

  },
  production: {
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: true,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
