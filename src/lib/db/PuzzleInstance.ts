import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
  UpdatedAt,
} from 'sequelize-typescript';

import Team from './Team';

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
    field: 'created_at',
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  updatedAt!: Date;

  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
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
  startedAt!: string;

  @Column({
    type: DataType.DATE,
    field: 'solved_at',
  })
  solvedAt!: string;

  @Column({
    type: DataType.JSONB,
    field: 'puzzle_payload',
  })
  puzzle_payload!: string;

  @Column({
    type: DataType.JSONB,
    field: 'solution_payload',
  })
  solution_payload!: string;
}

export default PuzzleInstance;
