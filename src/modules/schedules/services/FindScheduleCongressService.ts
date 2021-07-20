import { ObjectID } from "typeorm";
import { ISchedulesCongressRepository } from "../repositories/ISchedulesCongressRepository";

class FindScheduleCongressService {
  constructor(private repository: ISchedulesCongressRepository) {}

  async execute(id: string) {
    const schedule =  await this.repository.findById(id)
    if(!schedule) {
      throw new Error('Schedule not found!')
    }
    return schedule
  }
}

export { FindScheduleCongressService }