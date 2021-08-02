import { ISchedule, TypeOption } from "../model/ISchedule";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

class IRequest {
  id: string;

  name: string;

  type_proposition: TypeOption[];

  type_schedule: 'daily' | 'monthly'| 'weekly';

  tags: string[];

  active: boolean;
}

class UpdateScheduleService {
  constructor(
    private repository: ISchedulesRepository) {}

  async execute({id, name, type_proposition, type_schedule, tags, active }: IRequest): Promise<ISchedule> {
    const schedule = await this.repository.findById(id);

    if(!schedule) {
      throw new Error('Schedule not found')
    }

    Object.assign(schedule, {name, type_proposition, type_schedule, tags, active})
    
    const updatedSchedule = await this.repository.save(schedule)

    return updatedSchedule
  }
}

export { UpdateScheduleService }