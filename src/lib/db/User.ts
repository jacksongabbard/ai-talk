import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
  UpdatedAt,
} from 'sequelize-typescript';
import Team from './Team';

@Table({
  timestamps: true,
  tableName: 'users',
})
class User extends Model {
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
    field: 'user_name',
  })
  userName!: string;

  @Column({
    type: DataType.TEXT,
    field: 'email_address',
  })
  emailAddress!: string;

  @Column({
    type: DataType.TEXT,
    field: 'profile_pic',
  })
  profilePic!: string;

  @Column({
    type: DataType.TEXT,
    field: 'location',
  })
  location!: string;

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
    type: DataType.BOOLEAN,
    field: 'active',
    defaultValue: true,
  })
  active!: boolean;
}

export default User;
