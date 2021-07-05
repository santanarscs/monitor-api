import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

interface IRequest {
  page?: number;
  limit?: number;
}

class ListScheduleService {
  constructor(private repository: ISchedulesRepository) {}
  async execute({ page, limit }:IRequest) {
    const schedules = await this.repository.list({
      page, 
      limit
    })
    return schedules;
  }
}

export { ListScheduleService }