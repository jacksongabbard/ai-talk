import { Column, Table, Model, DataType } from 'sequelize-typescript';

import PuzzleInstance from './PuzzleInstance';
import User from './User';

@Table({
  timestamps: false,
  tableName: 'puzzle_instances_users',
})
class PuzzleInstanceUser extends Model {
  @Column({
    type: DataType.UUIDV4,
    field: 'puzzle_instance_id',
    references: {
      model: PuzzleInstance,
      key: 'id',
    },
    primaryKey: true,
  })
  puzzleInstanceId!: string;

  @Column({
    type: DataType.UUIDV4,
    field: 'user_id',
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  })
  userId!: string;
}

export default PuzzleInstanceUser;
