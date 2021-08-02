import { IJobsRepository } from "../repositories/IJobsRepository";

class ListJobsService {
  constructor(private repository: IJobsRepository){}

  async execute() {
    return await this.repository.list()
  }
}

export { ListJobsService }