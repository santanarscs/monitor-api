import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

class FindScheduleService {
  constructor(private repository: ISchedulesRepository) {}

  async execute(id: string) {
    const schedule =  await this.repository.findById(id)
    if(!schedule) {
      throw new Error('Schedule not found!')
    }
    return schedule
  }
}

export { FindScheduleService }