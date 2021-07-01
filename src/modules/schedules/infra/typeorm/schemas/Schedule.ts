import  { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm'
import { ISchedule } from '../../../model/ISchedule'

@Entity('schedules')
class Schedule implements ISchedule {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  owner_id: string

  @Column()
  type_schedule: string

  @Column()
  tags: string[]

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Schedule }