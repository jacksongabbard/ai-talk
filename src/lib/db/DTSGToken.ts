import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  updatedAt: false,
  tableName: 'dtsg_tokens',
})
class DTSGToken extends Model {
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

  @Column({
    field: 'expires_at',
  })
  expiresAt!: Date;

  @Column({
    type: DataType.TEXT,
    field: 'token_key',
  })
  tokenKey!: object;

  @Column({
    type: DataType.JSONB,
    field: 'token_value',
  })
  tokenValue!: object;
}

export default DTSGToken;
