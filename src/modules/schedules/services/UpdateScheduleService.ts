import { ObjectID } from "typeorm";
import { ISchedule } from "../model/ISchedule";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

class IRequest {
  id: string | ObjectID;
  title: string;
  owner_id: string;
  active: boolean;
  type_schedule: string;
  tags: string[]
}

class UpdateScheduleService {
  constructor(private repository: ISchedulesRepository) {}

  async execute({id, ...rest}: IRequest): Promise<ISchedule> {
    const schedule = await this.repository.findById(id);
    if(!schedule) {
      throw new Error('Schedule not found')
    }
    Object.assign(schedule, {...rest})
    return await this.repository.save(schedule)
  }
}

export { UpdateScheduleService }