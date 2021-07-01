import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository";


class ListJobsByScheduleService {
  constructor(private repository: IJobsCongressRepository) {}

  async execute(schedule_id: string) {
    return await this.repository.findByScheduleId(schedule_id)
  }
}

export { ListJobsByScheduleService }