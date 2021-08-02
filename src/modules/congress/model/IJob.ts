import { ObjectID } from "typeorm";

interface IItemJob {

  proposition_id: string;

  type_proposition: string;

  date_apresentation: Date;

  text: string;

  author: string;

  link: string;

  status: string;
}

interface IJob {
  
  id: string | ObjectID; 
 
  date_job: Date;

  schedule_id: ObjectID |string;

  origin: 'manual' | 'schedule';
  
  items: IItemJob[]
 
  created_at: Date;

  updated_at: Date;

}

export { IJob, IItemJob }