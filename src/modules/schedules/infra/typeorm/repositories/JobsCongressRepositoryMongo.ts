import { ICreateJobCongressDTO, IJobsCongressRepository } from '@modules/schedules/repositories/IJobsCongressRepository';
import { getMongoRepository, MongoRepository, Equal, In } from 'typeorm';
import { JobCongress } from '../schemas/JobCongress'
import { ObjectID } from 'mongodb'

class JobsCongressRepositoryMongo implements IJobsCongressRepository  {

  private ormRepository: MongoRepository<JobCongress>

  constructor() {
    this.ormRepository = getMongoRepository(JobCongress, "mongo")
  }
  async findByScheduleId(schedule_id: string): Promise<JobCongress[]> {
    const jobs = await this.ormRepository.find({
      where: {
        schedule_id: new ObjectID(schedule_id)
      },
      order: {
        date_job: 'DESC'
      }
    });
    return jobs;
  }

  async findById(id: string): Promise<JobCongress | undefined> {
    const job =  await this.ormRepository.findOne(id)
    return job
  }
  async list(): Promise<JobCongress[]> {
    return await this.ormRepository.find()
  }
  async create(data: ICreateJobCongressDTO): Promise<JobCongress> {
    const job = this.ormRepository.create(data)
    const createdJob = await this.ormRepository.save(job)
    return createdJob
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

export { JobsCongressRepositoryMongo }