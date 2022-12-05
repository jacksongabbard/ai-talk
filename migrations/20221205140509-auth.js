'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE auth_tokens (
        id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        token_value TEXT NOT NULL,
        user_id UUID NOT NULL,
      CONSTRAINT fk_user_id
        FOREIGN KEY(user_id) 
	        REFERENCES users(id)
      );
   `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE auth_tokens;
    `);
  },
};
