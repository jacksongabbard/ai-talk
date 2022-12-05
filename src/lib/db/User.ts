import { Column, IsUUID, PrimaryKey, Table, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;
}

/*
type User extends Model {}
User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'display_name',
    },
    profilePic: {
      type: DataTypes.STRING,
      field: 'profile_pic',
    },
    location: {
      type: DataTypes.STRING,
      field: 'location',
    },
    teamId: {
      type: DataTypes.UUID,
      field: 'team_id',
    },
  },
  {
    // Other model options go here
    SequelizeInstance, // We need to pass the connection instance
    tableName: 'users',
    modelName: 'User', // We need to choose the model name
  },
);
*/
