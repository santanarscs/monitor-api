import { IScheduleCongress, TypeOption } from "../model/IScheduleCongress";
import { ISchedulesCongressRepository } from "../repositories/ISchedulesCongressRepository"

interface IRequest {
  name: string;

  type_proposition: TypeOption[];

  type_schedule: 'daily' | 'monthly'| 'weekly';

  owner_id: string;

  tags: string[];

  active: boolean;
}

class CreateScheduleCongressService {

  constructor(private repository: ISchedulesCongressRepository) {}

  async execute({name, type_proposition, owner_id, type_schedule, tags, active}: IRequest): Promise<IScheduleCongress> {
    
    const schedule = await this.repository.create({name, type_proposition, owner_id, type_schedule, tags, active})

    return schedule;
  }
}

export { CreateScheduleCongressService }