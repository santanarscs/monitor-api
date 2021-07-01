import { ISchedule } from "../../../model/ISchedule";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tag } from "./Tag";


@Entity('schedules')
class Schedule implements ISchedule {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  title: string;
  
  @Column()
  target: string;
  
  @Column()
  owner_id: string;
  
  @Column()
  type_schedule: string;
  
  @OneToMany(() => Tag, tags => tags.schedule)
  tags: Tag[];
  
  @Column({default: true})
  active: boolean;
  
  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;
  
}

export { Schedule }