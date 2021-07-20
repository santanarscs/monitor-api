import { ObjectID } from "typeorm";
import { IItemJobCongress } from "./IItemJobCongress";

interface IJobCongress {
  
  id: string | ObjectID; 
 
  date_job: Date;

  schedule_id: ObjectID |string;
  
  items: IItemJobCongress[]
 
  created_at: Date;

  updated_at: Date;

}

export { IJobCongress }