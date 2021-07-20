import { ObjectID } from "typeorm";
import { IJobCongress } from "../model/IJobCongress";

interface ICreateJobCongressDTO {
  date_job: Date;
  schedule_id: ObjectID | string;
  items: any[]
}

interface IJobsCongressRepository {
  findById(id: string | any): Promise<IJobCongress | undefined>
  findByScheduleId(schedule_id: string): Promise<IJobCongress[]>
  list(): Promise<IJobCongress[]>
  create(data: ICreateJobCongressDTO): Promise<IJobCongress>
  createMany(data: ICreateJobCongressDTO[]): Promise<IJobCongress[]>
  save(data: IJobCongress): Promise<IJobCongress>
  delete(id: string): Promise<void>
}

export { IJobsCongressRepository, ICreateJobCongressDTO }