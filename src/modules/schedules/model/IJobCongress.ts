import { ObjectID } from "typeorm";

interface IItemJobCongress {

  proposition_id: string;

  type_proposition: string;

  date_apresentation: Date;

  text: string;

  author: string;

  link: string;

  status: string;
}

interface IJobCongress {
  
  id: string | ObjectID; 
 
  date_job: Date;

  schedule_id: ObjectID |string;

  origin: 'manual' | 'schedule';
  
  items: IItemJobCongress[]
 
  created_at: Date;

  updated_at: Date;

}

export { IJobCongress, IItemJobCongress }