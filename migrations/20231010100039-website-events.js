'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE cord_dot_com_events (
        id UUID NOT NULL PRIMARY KEY,
        session_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        current_page TEXT NULL,
        user_agent TEXT NULL,
        ip TEXT,
        ip_city TEXT,
        ip_region TEXT,
        ip_country TEXT,
        payload JSONB
      );
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TABLE cord_dot_com_events;
    `);
  },
};
