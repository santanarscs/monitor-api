import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

class ListScheduleService {
  constructor(private repository: ISchedulesRepository) {}
  async execute() {
    const schedules = await this.repository.list()
    return schedules;
  }
}

export { ListScheduleService }