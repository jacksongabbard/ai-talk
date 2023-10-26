'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE urls (
      id UUID PRIMARY KEY,
      index TEXT NOT NULL,
      url TEXT NOT NULL,
      last_scraped TIMESTAMP NULL
    );

    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE urls;
    `);
  },
};
