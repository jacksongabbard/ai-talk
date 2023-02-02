import {
  Column,
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

import PuzzleInstance from './PuzzleInstance';
import User from './User';

@Table({
  timestamps: true,
  tableName: 'puzzle_feedback',
})
class PuzzleFeedback extends Model {
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
    type: DataType.INTEGER,
    field: 'rating',
  })
  rating!: number;

  @Column({
    type: DataType.INTEGER,
    field: 'difficulty',
  })
  difficulty!: number;

  @Column({
    type: DataType.TEXT,
    field: 'feedback_text',
  })
  feedbackText!: string;
}

export default PuzzleFeedback;
