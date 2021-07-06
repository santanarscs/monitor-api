import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

interface IRequest {
  page?: number;
  limit?: number;
  owner_id?: string
}

class ListScheduleService {
  constructor(private repository: ISchedulesRepository) {}
  async execute({ page, limit, owner_id }:IRequest) {
    const schedules = await this.repository.list({
      page, 
      limit,
      owner_id
    })
    return schedules;
  }
}

export { ListScheduleService }