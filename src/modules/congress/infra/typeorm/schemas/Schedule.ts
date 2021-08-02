import { ISchedule, TypeOption } from "../../../model/ISchedule";
import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn,  UpdateDateColumn } from "typeorm";

@Entity('schedules_congress')
class Schedule implements ISchedule{
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  type_proposition: TypeOption[];

  @Column()
  type_schedule: 'daily' | 'monthly'| 'weekly';

  @Column()
  owner_id: string;

  @Column()
  tags: string[];

  @Column({default: true})
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { Schedule }