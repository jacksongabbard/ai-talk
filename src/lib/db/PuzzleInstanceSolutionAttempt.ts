import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
} from 'sequelize-typescript';

import User from './User';

@Table({
  timestamps: true,
  tableName: 'puzzle_instance_actions',
})
class PuzzleInstanceSolutionAttempt extends Model {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @Column({
    type: DataType.UUIDV4,
    field: 'puzzle_instance_id',
  })
  puzzleInstanceId!: string;

  @Column({
    type: DataType.UUIDV4,
    defaultValue: DataType.UUIDV4,
    field: 'user_id',
    references: {
      model: User,
      key: 'id',
    },
  })
  userId!: string;

  @Column({
    type: DataType.JSONB,
    field: 'solution_attempt_payload',
  })
  solutionAttemptPayload!: object;
}

export default PuzzleInstanceSolutionAttempt;
