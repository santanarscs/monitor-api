import { ISchedule } from "../model/ISchedule";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository"

interface IRequest {
  title: string;
  owner_id: string;
  active: boolean,
  repeat: string;
  tags: string[]
}

class CreateScheduleService {

  constructor(private repository: ISchedulesRepository) {
    
  }

  async execute({title, owner_id, active, repeat, tags}: IRequest): Promise<ISchedule> {
        
    const scheduleAlreadyExists = await this.repository.findByTitle(title)

    if(scheduleAlreadyExists) {
      throw new Error("Schedule Already exists!")
    }

    const schedule = await this.repository.create({title, owner_id, active, repeat, tags})
    
    return schedule;
  }
}

export { CreateScheduleService }