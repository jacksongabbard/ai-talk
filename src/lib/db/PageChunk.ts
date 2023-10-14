import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'page_chunks',
})
class PageChunk extends Model {
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
    type: DataType.TEXT,
    field: 'chunk',
  })
  chunk!: string;

  @Column({
    type: DataType.TEXT,
    field: 'url',
  })
  url!: string;

  @Column({
    type: DataType.TEXT,
    field: 'title',
  })
  title!: string;
}

export default PageChunk;
