'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE EXTENSION IF NOT EXISTS "vector";

    CREATE TABLE vectors (
      hash TEXT NOT NULL PRIMARY KEY,
      index TEXT,
      embedding vector(1536)
    );

    CREATE TABLE page_chunks (
      hash TEXT NOT NULL PRIMARY KEY,
      index TEXT NOT NULL,
      chunk TEXT NOT NULL,
      url TEXT NOT NULL,
      title TEXT NOT NULL
    );

    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "vector";

      DROP TABLE vectors;
      DROP TABLE page_chunks;
    `);
  },
};
