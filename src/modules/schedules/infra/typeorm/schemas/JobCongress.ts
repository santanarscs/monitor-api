import { IJobCongress, IItem } from "../../../model/IJobCongress";
import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from "typeorm";


@Entity('jobs_congress')
class JobCongress implements IJobCongress {
  
  @ObjectIdColumn()
  id: ObjectID;
  
  @Column()
  date_job: Date;
  
  @Column()
  owner_id: string;
  
  @Column()
  type_job: string;
  
  @Column()
  tags: string[]

  @Column()
  items: IItem[]

  @Column('uuid')
  schedule_id: string | ObjectID;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}

export { JobCongress }