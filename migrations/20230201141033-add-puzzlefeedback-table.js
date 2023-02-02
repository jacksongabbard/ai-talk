'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      BEGIN;
        CREATE TABLE puzzle_feedback (
          id UUID NOT NULL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
          puzzle_id TEXT NOT NULL,
          UNIQUE(user_id, puzzle_id),

          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

          rating SMALLINT NOT NULL CHECK (rating between 1 and 5),
          difficulty SMALLINT NOT NULL CHECK (difficulty between 1 and 5),
          feedback_text TEXT NULL);
        COMMIT;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE puzzle_feedback;
      COMMIT;
    `);
  },
};
