import {
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  Model,
  CreatedAt,
  DataType,
  UpdatedAt,
  Default,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'teams',
})
class Team extends Model {
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
    type: DataType.TEXT,
    field: 'team_name',
  })
  teamName!: string;

  @Column({
    type: DataType.TEXT,
    field: 'location',
  })
  location!: string;
}

export default Team;
