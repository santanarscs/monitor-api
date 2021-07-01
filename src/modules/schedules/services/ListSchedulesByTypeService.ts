import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

class ListSchedulesByTypeService {
  constructor(private repository: ISchedulesRepository){}

  async execute(type_schedule: string) {
    return await this.repository.findByTypeSchedule(type_schedule)
  }
}

export { ListSchedulesByTypeService }