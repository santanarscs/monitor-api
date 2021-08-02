import { ISchedulesRepository, IFindScheduleDTO, ICreateScheduleDTO } from '../../../repositories/ISchedulesRepository';
import { getMongoRepository, MongoRepository } from 'typeorm'
import { Schedule } from '../schemas/Schedule';

class SchedulesRepository implements ISchedulesRepository {
  private ormRepository: MongoRepository<Schedule>;

  constructor() {
    this.ormRepository = getMongoRepository(Schedule, 'mongo');
  }
  
  async findByTypeSchedule(type_schedule: 'daily' | 'monthly'| 'weekly'): Promise<Schedule[]> {
    return await this.ormRepository.find({type_schedule, active: true})
  }
  
  async findById(id: string): Promise<Schedule | undefined> {
    const schedule = await this.ormRepository.findOne(id);
    return schedule;
  }
  async save(data: Schedule): Promise<Schedule> {
    return this.ormRepository.save(data);
  }
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }
  
  async list({owner_id}: IFindScheduleDTO): Promise<Schedule[]> {
    return await this.ormRepository.find({
      where: {
        owner_id
      },
      order: {
        created_at: 'DESC'
      }
    })

  }
  async create(data: ICreateScheduleDTO): Promise<Schedule> {
    const schedule = this.ormRepository.create(data)
    return await this.ormRepository.save(schedule)
  }
}

export { SchedulesRepository }