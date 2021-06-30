import { IJobCongress, IItem } from "../model/IJobCongress";

interface ICreateJobCongressDTO {
  date_job: Date;

  owner_id: string;
  
  type_job: string;

  items: IItem[]
}

interface IJobsCongressRepository {
  findByText(text: string): Promise<IJobCongress | undefined>
  findById(id: string | any): Promise<IJobCongress | undefined>
  list(): Promise<IJobCongress[]>
  create(data: ICreateJobCongressDTO): Promise<IJobCongress>
  createMany(data: ICreateJobCongressDTO[]): Promise<IJobCongress[]>
  save(data: IJobCongress): Promise<IJobCongress>
  delete(id: string): Promise<void>
}

export { IJobsCongressRepository, ICreateJobCongressDTO }