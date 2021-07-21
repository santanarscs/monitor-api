import { IScheduleCongress, TypeOption } from "../model/IScheduleCongress";
import { ISchedulesCongressRepository } from "../repositories/ISchedulesCongressRepository";

class IRequest {
  id: string;

  name: string;

  type_proposition: TypeOption[];

  type_schedule: 'daily' | 'monthly'| 'weekly';

  tags: string[];

  active: boolean;
}

class UpdateScheduleCongressService {
  constructor(
    private repository: ISchedulesCongressRepository) {}

  async execute({id, name, type_proposition, type_schedule, tags, active }: IRequest): Promise<IScheduleCongress> {
    const schedule = await this.repository.findById(id);

    if(!schedule) {
      throw new Error('Schedule not found')
    }

    Object.assign(schedule, {name, type_proposition, type_schedule, tags, active})
    
    const updatedSchedule = await this.repository.save(schedule)

    return updatedSchedule
  }
}

export { UpdateScheduleCongressService }