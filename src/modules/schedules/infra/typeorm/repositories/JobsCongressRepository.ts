import { getRepository, Repository } from 'typeorm';
import { ICreateJobCongressDTO, IJobsCongressRepository } from '../../../repositories/IJobsCongressRepository'
import { JobCongress } from '../entities/JobCongress'

class JobsCongressRepository implements IJobsCongressRepository {

  private ormRepository: Repository<JobCongress>

  constructor() {
    this.ormRepository = getRepository(JobCongress)
  }
  async findByScheduleId(schedule_id: string): Promise<JobCongress[]> {
    return await this.ormRepository.find({schedule_id});
  }

  async findByText(text: string): Promise<JobCongress> {
    throw new Error('remove method')
  }
  async findById(id: string): Promise<JobCongress | undefined> {
    return await this.ormRepository.findOne(id)
  }
  async list(): Promise<JobCongress[]> {
    return await this.ormRepository.find()
  }
  async create(data: ICreateJobCongressDTO): Promise<JobCongress> {
    const job = this.ormRepository.create(data)
    await this.ormRepository.save(job)
    return job
  }

  async createMany(data: ICreateJobCongressDTO[]): Promise<JobCongress[]>{
    const jobs = this.ormRepository.create(data)
    await this.ormRepository.save(jobs)
    return jobs
  }

  async save(data: JobCongress): Promise<JobCongress> {
    return await this.ormRepository.save(data)
  }
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }
}

export { JobsCongressRepository }