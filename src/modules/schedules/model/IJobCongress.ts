import { ObjectID } from "typeorm";


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
  
  tags: string[]

  date_job: Date;

  owner_id: string;
  
  type_job: string;

  items: IItem[]
}

export { IJobCongress, IItem }