import {
  Column,
  Table,
  Model,
  CreatedAt,
  DataType,
} from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'cord_dot_com_events',
})
class CordDotComEvent extends Model {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    field: 'session_id',
  })
  sessionID!: string;

  @Column({
    type: DataType.TEXT,
    field: 'event_type',
  })
  eventType!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt!: Date;

  @Column({
    type: DataType.TEXT,
    field: 'current_page',
  })
  currentPage!: string;

  @Column({
    type: DataType.TEXT,
    field: 'user_agent',
  })
  userAgent!: string;

  @Column({
    type: DataType.TEXT,
    field: 'ip',
  })
  ip!: string;

  @Column({
    type: DataType.TEXT,
    field: 'ip_city',
  })
  ipCity!: string;

  @Column({
    type: DataType.TEXT,
    field: 'ip_region',
  })
  ipRegion!: string;

  @Column({
    type: DataType.TEXT,
    field: 'ip_country',
  })
  ipCountry!: string;

  @Column({
    type: DataType.JSONB,
    field: 'payload',
  })
  payload!: any;
}

export default CordDotComEvent;
