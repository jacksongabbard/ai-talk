import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
  UpdatedAt,
} from 'sequelize-typescript';

import Team from './Team';
import User from './User';

@Table({
  timestamps: true,
  tableName: 'puzzle_instances',
})
class PuzzleInstance extends Model {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    field: 'puzzle_id',
  })
  puzzleId!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt!: Date;

  @Column({
    type: DataType.UUIDV4,
    field: 'user_id',
    references: {
      model: User,
      key: 'id',
    },
  })
  userId!: string;

  @Column({
    type: DataType.UUIDV4,
    field: 'team_id',
    references: {
      model: Team,
      key: 'id',
    },
  })
  teamId!: string;

  @Column({
    type: DataType.DATE,
    field: 'started_at',
  })
  startedAt!: Date;

  @Column({
    type: DataType.DATE,
    field: 'solved_at',
  })
  solvedAt!: Date | null;

  @Column({
    type: DataType.INTEGER,
    field: 'sequence_number',
  })
  sequenceNumber!: number;

  @Column({
    type: DataType.JSONB,
    field: 'puzzle_payload',
  })
  puzzlePayload!: object;

  @Column({
    type: DataType.JSONB,
    field: 'solution_payload',
  })
  solutionPayload!: object;
}

export default PuzzleInstance;
