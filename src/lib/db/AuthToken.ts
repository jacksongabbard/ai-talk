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
  tableName: 'auth_tokens',
})
class AuthToken extends Model {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

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
    field: 'expires_at',
  })
  expiresAt!: Date;

  @Column({
    type: DataType.STRING,
    field: 'token_value',
  })
  tokenValue!: string;

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
}

export default AuthToken;
