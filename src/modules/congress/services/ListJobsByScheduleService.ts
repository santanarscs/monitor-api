import { IJobsRepository } from "../repositories/IJobsRepository";


class ListJobsByScheduleService {
  constructor(private repository: IJobsRepository) {}

  async execute(schedule_id: string) {
    return await this.repository.findByScheduleId(schedule_id)
  }
}

export { ListJobsByScheduleService }