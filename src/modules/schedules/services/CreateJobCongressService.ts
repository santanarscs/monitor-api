import { IJobCongress, IItem } from "../model/IJobCongress";
import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository"

interface IRequest {
  date_job: Date;

  owner_id: string;
  
  type_job: string;

  items: IItem[]
}

class CreateJobCongressService {

  constructor(private repository: IJobsCongressRepository) {}

  async execute({
    date_job,
    owner_id,
    type_job,
    items
  }: IRequest): Promise<IJobCongress> {

    const job = await this.repository.create({
      date_job,
      owner_id,
      type_job,
      items
    })
    
    return job;
  }
}

export { CreateJobCongressService }