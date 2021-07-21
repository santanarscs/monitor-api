import { IJobCongress, IItemJobCongress } from "@modules/schedules/model/IJobCongress";
import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn,  UpdateDateColumn } from "typeorm";

@Entity('jobs_congress')
class JobCongress implements IJobCongress {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  date_job: Date;

  @Column('uuid')
  schedule_id: ObjectID |string ;

  @Column()
  items: IItemJobCongress[];

  @Column()
  origin: 'manual' | 'schedule'

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { JobCongress }