import { IItemJobCongress } from "../../../model/IItemJobCongress";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JobCongress } from "./JobCongress";

@Entity('items_jobs_congress')
class ItemJobCongress implements IItemJobCongress{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  proposition_id: string;

  @Column()
  type_proposition: string;
  
  @Column('time with time zone')
  date_apresentation: Date;

  @Column()
  text: string;
  
  @Column()
  author: string;
  
  @Column()
  link: string;
  
  @Column()
  status: string;

  @Column()
  job_congress_id: string

  @ManyToOne(() => JobCongress)
  @JoinColumn({name: 'job_congress_id'})
  job_congres: JobCongress
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}

export { ItemJobCongress }