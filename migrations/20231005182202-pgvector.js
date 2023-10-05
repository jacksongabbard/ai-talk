'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE EXTENSION IF NOT EXISTS "pgvector";

    CREATE TABLE vectors (
      hash TEXT NOT NULL PRIMARY KEY,
      index TEXT,
      embedding vector(1536)
    );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "pgvector";

      DROP TABLE vectors;
    `);
  },
};
