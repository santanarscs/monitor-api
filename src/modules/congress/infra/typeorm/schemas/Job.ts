import { IJob, IItemJob } from "../../../model/IJob";
import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn,  UpdateDateColumn } from "typeorm";

@Entity('jobs_congress')
class Job implements IJob {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  date_job: Date;

  @Column('uuid')
  schedule_id: ObjectID |string ;

  @Column()
  items: IItemJob[];

  @Column()
  origin: 'manual' | 'schedule'

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Job }