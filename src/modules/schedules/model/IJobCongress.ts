import { ObjectID } from "typeorm";
import { ISchedule } from "./ISchedule";


interface IItem {
  proposition_id: string;
  
  date_apresentation: Date;

  text: string;
  
  author: string;
  
  link: string;
  
  status: string;
}

interface IJobCongress {
  
  id: string | ObjectID;
  
  date_job: Date;

  schedule_id: string | ObjectID;
  
  items: IItem[]
}

export { IJobCongress, IItem }