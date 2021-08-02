import { ObjectID } from "typeorm";
import { IJob } from "../model/IJob";

interface ICreateJobDTO {
  date_job: Date;
  schedule_id: ObjectID | string;
  origin: 'manual' | 'schedule';
  items: any[]
}

interface IJobsRepository {
  findById(id: string | any): Promise<IJob | undefined>
  findByScheduleId(schedule_id: string): Promise<IJob[]>
  list(): Promise<IJob[]>
  create(data: ICreateJobDTO): Promise<IJob>
  createMany(data: ICreateJobDTO[]): Promise<IJob[]>
  save(data: IJob): Promise<IJob>
  delete(id: string): Promise<void>
}

export { IJobsRepository, ICreateJobDTO }