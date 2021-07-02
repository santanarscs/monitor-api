import { IItemJobCongress } from "../model/IItemJobCongress";

interface ICreateItemJobCongressDTO {
  proposition_id: string;

  type_proposition: string;
  
  date_apresentation: Date;

  text: string;
  
  author: string;
  
  link: string;
  
  status: string;

  job_congress_id: string
}


interface IItemsJobCongressRepository {
  findById(id: string | any): Promise<IItemJobCongress | undefined>
  list(): Promise<IItemJobCongress[]>
  create(data: ICreateItemJobCongressDTO): Promise<IItemJobCongress>
  createMany(data: ICreateItemJobCongressDTO[]): Promise<IItemJobCongress[]>
  save(data: IItemJobCongress): Promise<IItemJobCongress>
  delete(id: string): Promise<void>
}
export { IItemsJobCongressRepository, ICreateItemJobCongressDTO }