import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'vectors',
})
class Vector extends Model {
  @Column({
    type: DataType.TEXT,
    primaryKey: true,
  })
  hash!: string;

  @Column({
    type: DataType.TEXT,
    field: 'index',
  })
  index!: string;

  @Column({
    type: DataType.STRING,
    field: 'embedding',
  })
  embedding!: string;
}

export default Vector;
