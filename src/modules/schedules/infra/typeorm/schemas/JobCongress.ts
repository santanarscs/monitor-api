import { IJobCongress, IItem } from "../../../model/IJobCongress";
import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from "typeorm";


class Item implements IItem {
  @Column()
  proposition_id: string;
  
  @Column()
  date_apresentation: Date;

  @Column()
  text: string;
  
  @Column()
  author: string;
  
  @Column()
  link: string;
  
  @Column()
  status: string;

  constructor(
    proposition_id: string,
    date_apresentation: Date,
    text: string,
    author: string,
    link: string,
    status: string,
    ) {
      this.proposition_id = proposition_id
      this.date_apresentation = date_apresentation
      this.text = text
      this.author = author
      this.link = link
      this.status = status
    }
}


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
  items: Item[]
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}

export { JobCongress, Item }