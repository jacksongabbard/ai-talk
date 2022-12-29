import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
  UpdatedAt,
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
    type: DataType.TEXT,
    field: 'team_name',
  })
  teamName!: string;

  @Column({
    type: DataType.TEXT,
    field: 'location',
  })
  location!: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'active',
    defaultValue: true,
  })
  active!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    field: 'public',
    defaultValue: true,
  })
  public!: boolean;
}

export default Team;
