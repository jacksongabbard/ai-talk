'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE puzzle_instances_users (
        puzzle_instance_id UUID REFERENCES puzzle_instances(id) ON UPDATE CASCADE ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        CONSTRAINT puzzle_instances_users_primary_key PRIMARY KEY (puzzle_instance_id, user_id)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE puzzle_instances_users;
    `);
  },
};
