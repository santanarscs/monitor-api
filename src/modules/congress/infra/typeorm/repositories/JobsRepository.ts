import { ICreateJobDTO, IJobsRepository } from '../../../repositories/IJobsRepository';
import { getMongoRepository, MongoRepository, Equal, In } from 'typeorm';
import { Job } from '../schemas/Job'
import { ObjectID } from 'mongodb'

class JobsRepository implements IJobsRepository  {

  private ormRepository: MongoRepository<Job>

  constructor() {
    this.ormRepository = getMongoRepository(Job, "mongo")
  }
  async findByScheduleId(schedule_id: string): Promise<Job[]> {
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

  async findById(id: string): Promise<Job | undefined> {
    const job =  await this.ormRepository.findOne(id)
    return job
  }
  async list(): Promise<Job[]> {
    return await this.ormRepository.find()
  }
  async create(data: ICreateJobDTO): Promise<Job> {
    const job = this.ormRepository.create(data)
    const createdJob = await this.ormRepository.save(job)
    return createdJob
  }

  async createMany(data: ICreateJobDTO[]): Promise<Job[]>{
    const jobs = this.ormRepository.create(data)
    await this.ormRepository.save(jobs)
    return jobs
  }

  async save(data: Job): Promise<Job> {
    return await this.ormRepository.save(data)
  }
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }
}

export { JobsRepository }