import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

class FindScheduleService {
  constructor(private repository: ISchedulesRepository) {}

  async execute(id: string) {
    return await this.repository.findById(id)
  }
}

export { FindScheduleService }