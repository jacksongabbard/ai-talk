import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
  UpdatedAt,
} from 'sequelize-typescript';

import User from './User';

@Table({
  timestamps: true,
  tableName: 'puzzle_instance_actions',
})
class PuzzleInstanceAction extends Model {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

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
  teamId!: string;

  @CreatedAt
  @Column({
    field: 'created_at',
  })
  createdAt!: Date;

  @Column({
    type: DataType.INTEGER,
    field: 'sequence_number',
  })
  sequenceNumber!: string;

  @Column({
    type: DataType.JSONB,
    field: 'payload',
  })
  payload!: string;
}

export default PuzzleInstanceAction;
