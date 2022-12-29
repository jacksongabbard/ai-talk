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
      team_name TEXT NOT NULL UNIQUE CHECK (
        LENGTH(team_name) >= 2 
        AND LENGTH(team_name) <= 48
        AND team_name ~* '^(?:[a-zA-Z0-9][a-zA-Z0-9_-]{0,46}[a-zA-Z0-9])$'
      ),
      location TEXT NULL CHECK (LENGTH(location) <= 48),
      active BOOLEAN NOT NULL DEFAULT TRUE
      public BOOLEAN DEFAULT TRUE
    );
    CREATE UNIQUE INDEX team_name_upper_idx ON teams (UPPER(team_name));

    CREATE TABLE users (
      id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      user_name TEXT NOT NULL UNIQUE CHECK (
        LENGTH(user_name) >= 2
        AND LENGTH(user_name) <= 48
        AND user_name ~* '^(?:[a-zA-Z0-9][a-zA-Z0-9_-]{0,46}[a-zA-Z0-9])$'
      ),
      email_address TEXT NOT NULL UNIQUE,
      profile_pic TEXT NULL,
      location TEXT NULL CHECK (LENGTH(location) <= 48),
      team_id UUID NULL REFERENCES teams(id) ON DELETE CASCADE,
      active BOOLEAN NOT NULL DEFAULT TRUE
      public BOOLEAN DEFAULT TRUE
    );
    CREATE UNIQUE INDEX user_name_upper_idx ON users (UPPER(user_name));

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
