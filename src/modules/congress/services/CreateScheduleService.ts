import { ISchedule, TypeOption } from "../model/ISchedule";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository"

interface IRequest {
  name: string;

  type_proposition: TypeOption[];

  type_schedule: 'daily' | 'monthly'| 'weekly';

  owner_id: string;

  tags: string[];

  active: boolean;
}

class CreateScheduleService {

  constructor(private repository: ISchedulesRepository) {}

  async execute({name, type_proposition, owner_id, type_schedule, tags, active}: IRequest): Promise<ISchedule> {
    
    const schedule = await this.repository.create({name, type_proposition, owner_id, type_schedule, tags, active})

    return schedule;
  }
}

export { CreateScheduleService }