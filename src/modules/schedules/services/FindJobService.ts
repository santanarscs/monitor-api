import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository";

class FindJobService {
  constructor(private repository: IJobsCongressRepository) {}

  async execute(id: string) {
    const job = await this.repository.findById(id)
    
    if(!job) {
      throw new Error('Schedule not found')
    }
    return job
  }
}

export { FindJobService }