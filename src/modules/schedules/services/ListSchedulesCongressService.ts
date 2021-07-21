import { ISchedulesCongressRepository } from "../repositories/ISchedulesCongressRepository";

interface IRequest {
  owner_id: string
}

class ListSchedulesCongressService {
  constructor(private repository: ISchedulesCongressRepository) {}
  async execute({ owner_id }:IRequest) {
    const schedules = await this.repository.list({
      owner_id
    })
    return schedules;
  }
}

export { ListSchedulesCongressService }