import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

interface IRequest {
  owner_id: string
}

class ListSchedulesService {
  constructor(private repository: ISchedulesRepository) {}
  async execute({ owner_id }:IRequest) {
    const schedules = await this.repository.list({
      owner_id
    })
    return schedules;
  }
}

export { ListSchedulesService }