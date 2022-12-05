import {
  Column,
  IsUUID,
  PrimaryKey,
  Table,
  Model,
  CreatedAt,
  DataType,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'teams',
})
class Team extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @CreatedAt
  creationAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column(DataType.TEXT)
  displayName: string;

  @Column(DataType.TEXT)
  location: string;
}

export default Team;
