
interface IItemJobCongress {
  
  id: string;

  proposition_id: string;

  type_proposition: string;
  
  date_apresentation: Date;

  text: string;
  
  author: string;
  
  link: string;
  
  status: string;

  job_congress_id: string
  
  created_at: Date;

  updated_at: Date;
}

export  { IItemJobCongress }