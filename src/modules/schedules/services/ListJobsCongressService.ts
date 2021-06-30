import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository";

class ListJobsCongressService {
  constructor(private repository: IJobsCongressRepository){}

  async execute() {
    return await this.repository.list()
  }
}

export { ListJobsCongressService }