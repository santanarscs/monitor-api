import { ISchedule } from "../model/ISchedule";

interface ICreateScheduleDTO {
  title: string;
  target: string;
  owner_id: string;
  type_schedule: string;
}

interface IFindScheduleDTO {
  page?: number;
  limit?: number;
}


interface ISchedulesRepository {
  findByTitle(title: string): Promise<ISchedule | undefined>
  findById(id: string | any): Promise<ISchedule | undefined>
  findByTypeSchedule(type_schedule: string): Promise<ISchedule[]>
  list(data: IFindScheduleDTO): Promise<[ISchedule[], number]>
  create(data: ICreateScheduleDTO): Promise<ISchedule>
  save(data: ISchedule): Promise<ISchedule>
  delete(id: string): Promise<void>
}

export { ISchedulesRepository, ICreateScheduleDTO, IFindScheduleDTO }