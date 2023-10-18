'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE EXTENSION IF NOT EXISTS "vector";

    CREATE TABLE page_chunks (
      index TEXT NOT NULL,
      chunk TEXT NOT NULL,
      embedding vector(1536),
      url TEXT NOT NULL,
      title TEXT NOT NULL
    );

    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE page_chunks;
    `);
  },
};
