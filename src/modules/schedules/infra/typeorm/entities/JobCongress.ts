import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Schedule } from "./Schedule";
import { ItemJobCongress } from "./ItemJobCongress";
import { IJobCongress } from "../../../model/IJobCongress";


@Entity('jobs_congress')
class JobCongress implements IJobCongress{

  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column('time with time zone')
  date_job: Date;

  @Column()
  schedule_id: string;
 
  @ManyToOne(() => Schedule, {eager: true})
  @JoinColumn({name: 'schedule_id'})
  schedule: Schedule
  
  @OneToMany(() => ItemJobCongress, items => items.job_congres, {eager: true})
  items: ItemJobCongress[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}

export { JobCongress }