import { ITag } from "modules/schedules/model/ITag";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Schedule } from "./Schedule";

@Entity('tags')
class Tag implements ITag {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  name: string;

  @Column()
  schedule_id: string

  @ManyToOne(() => Schedule)
  @JoinColumn({name: 'schedule_id'})
  schedule: Schedule;

  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;

}

export { Tag }