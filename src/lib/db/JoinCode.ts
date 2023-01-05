import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
} from 'sequelize-typescript';

import Team from './Team';
import User from './User';

@Table({
  timestamps: true,
  updatedAt: false,
  tableName: 'join_codes',
})
class JoinCode extends Model {
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
    type: DataType.DATE,
    field: 'expires_at',
  })
  expiresAt!: Date;

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
    type: DataType.TEXT,
    field: 'join_code',
  })
  code!: object;
}

export default JoinCode;
