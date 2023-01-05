'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE join_codes (
        id UUID NOT NULL PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        team_id UUID REFERENCES teams(id) ON UPDATE CASCADE ON DELETE CASCADE,
        join_code TEXT NOT NULL UNIQUE CHECK (
          join_code ~* '^(?:[A-Z0-9]{8})$'
        )
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE join_codes;
    `);
  },
};
