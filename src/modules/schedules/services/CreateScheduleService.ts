import { ISchedulesRepository } from "../repositories/ISchedulesRepository"

interface IRequest {
  title: string;
  owner_id: string;
}

class CreateScheduleService {

  constructor(private repository: ISchedulesRepository) {
    
  }

  execute({title, owner_id}: IRequest): void {
        
    const scheduleAlreadyExists = this.repository.findByTitle(title)

    if(scheduleAlreadyExists) {
      throw new Error("Schedule Already exists!")
    }

    this.repository.create({title, owner_id})
  }
}

export { CreateScheduleService }