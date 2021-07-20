import { ObjectID } from "typeorm";
import { IScheduleCongress, TypeOption } from "../model/IScheduleCongress";

interface ICreateScheduleCongressDTO {

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

interface ISchedulesCongressRepository {
  findById(id: string): Promise<IScheduleCongress | undefined>
  findByTypeSchedule(type_schedule: string): Promise<IScheduleCongress[]>
  list(data: IFindScheduleDTO): Promise<IScheduleCongress[]>
  create(data: ICreateScheduleCongressDTO): Promise<IScheduleCongress>
  save(data: IScheduleCongress): Promise<IScheduleCongress>
  delete(id: string): Promise<void>
}

export { ISchedulesCongressRepository, ICreateScheduleCongressDTO, IFindScheduleDTO }