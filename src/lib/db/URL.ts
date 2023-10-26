import {
  Column,
  Table,
  Model,
  DataType,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'urls',
})
class URL extends Model {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'last_scraped',
  })
  lastScraped!: Date | null;

  @Column({
    type: DataType.TEXT,
    field: 'index',
  })
  index!: string;

  @Column({
    type: DataType.TEXT,
    field: 'url',
  })
  url!: string;
}

export default URL;
