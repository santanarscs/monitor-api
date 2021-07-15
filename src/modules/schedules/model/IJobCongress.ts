import { IItemJobCongress } from "./IItemJobCongress";

interface IJobCongress {
  
  id: string;
 
  date_job: Date;

  schedule_id: string;
  
  items: IItemJobCongress[]
 
  created_at: Date;

  updated_at: Date;

}

export { IJobCongress }