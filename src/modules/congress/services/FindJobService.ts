import { IJobsRepository } from "../repositories/IJobsRepository";

class FindJobService {
  constructor(private repository: IJobsRepository) {}

  async execute(id: string) {
    const job = await this.repository.findById(id)
    
    if(!job) {
      throw new Error('Schedule not found')
    }
    return job
  }
}

export { FindJobService }