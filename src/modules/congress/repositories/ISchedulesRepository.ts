import { ISchedule, TypeOption } from "../model/ISchedule";

interface ICreateScheduleDTO {

  name: string;

  type_proposition: TypeOption[];

  type_schedule: 'daily' | 'monthly'| 'weekly';

  owner_id: string;

  tags: string[];

  active: boolean;

}

interface IFindScheduleDTO {
  owner_id: string
}

interface ISchedulesRepository {
  findById(id: string): Promise<ISchedule | undefined>
  findByTypeSchedule(type_schedule: string): Promise<ISchedule[]>
  list(data: IFindScheduleDTO): Promise<ISchedule[]>
  create(data: ICreateScheduleDTO): Promise<ISchedule>
  save(data: ISchedule): Promise<ISchedule>
  delete(id: string): Promise<void>
}

export { ISchedulesRepository, ICreateScheduleDTO, IFindScheduleDTO }