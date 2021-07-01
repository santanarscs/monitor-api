import { ISchedule } from "../model/ISchedule";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository"

interface IRequest {
  title: string;
  target: string;
  owner_id: string;
  active: boolean,
  type_schedule: string;
  tags: string[]
}

class CreateScheduleService {

  constructor(private repository: ISchedulesRepository) {
    
  }

  async execute({title, target, owner_id, active, type_schedule, tags}: IRequest): Promise<ISchedule> {
        
    const scheduleAlreadyExists = await this.repository.findByTitle(title)

    if(scheduleAlreadyExists) {
      throw new Error("Schedule Already exists!")
    }

    const schedule = await this.repository.create({title, target, owner_id, active, type_schedule, tags})
    
    return schedule;
  }
}

export { CreateScheduleService }