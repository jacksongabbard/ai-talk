'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE teams (
      id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      team_name TEXT NOT NULL UNIQUE,
      location TEXT NULL
    );

    CREATE TABLE users (
      id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      user_name TEXT NOT NULL UNIQUE,
      email_address TEXT NOT NULL UNIQUE,
      profile_pic TEXT NULL,
      location TEXT NULL,
      team_id UUID NULL,
      CONSTRAINT fk_team
        FOREIGN KEY(team_id) 
	        REFERENCES teams(id)
    );
    
    CREATE TABLE puzzle_instances (
      id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
      puzzle_id TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      team_id UUID NOT NULL,
      started_at TIMESTAMP WITH TIME ZONE NOT NULL,
      solved_at TIMESTAMP WITH TIME ZONE NULL,
      puzzle_payload JSONB NULL,
      solution_payload JSONB NULL,
      CONSTRAINT fk_team_id
        FOREIGN KEY(team_id) 
	        REFERENCES teams(id)
    );

    CREATE TABLE puzzle_instance_actions (
      id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
      puzzle_instance_id UUID NOT NULL,
      user_id UUID NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      sequence_number INT NOT NULL,
      payload JSONB NOT NULL,
      CONSTRAINT fk_puzzle_instance_id
        FOREIGN KEY(puzzle_instance_id) 
	        REFERENCES puzzle_instances(id),
      CONSTRAINT fk_user_id
        FOREIGN KEY(user_id) 
	        REFERENCES users(id)
    );

    CREATE TABLE puzzle_instance_solution_attempts (
      id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      puzzle_instance_id UUID NOT NULL,
      user_id UUID NOT NULL,
      solution_attempt_payload JSONB NOT NULL,
      CONSTRAINT fk_puzzle_instance_id
        FOREIGN KEY(puzzle_instance_id) 
	        REFERENCES puzzle_instances(id),
      CONSTRAINT fk_user_id
        FOREIGN KEY(user_id) 
	        REFERENCES users(id)
    );

   `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP TABLE puzzle_instance_solution_attempts;
    DROP TABLE puzzle_instance_actions;
    DROP TABLE puzzle_instances;
    DROP TABLE users;
    DROP TABLE teams;
  `);
  },
};
