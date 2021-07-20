import { ISchedulesCongressRepository, IFindScheduleDTO, ICreateScheduleCongressDTO } from '@modules/schedules/repositories/ISchedulesCongressRepository';
import { getMongoRepository, MongoRepository, ObjectID } from 'typeorm'
import { ScheduleCongress } from '../schemas/ScheduleCongress';

class SchedulesCongressRepositoryMongo implements ISchedulesCongressRepository {
  private ormRepository: MongoRepository<ScheduleCongress>;

  constructor() {
    this.ormRepository = getMongoRepository(ScheduleCongress, 'mongo');
  }
  
  async findByTypeSchedule(type_schedule: 'daily' | 'monthly'| 'weekly'): Promise<ScheduleCongress[]> {
    return await this.ormRepository.find({type_schedule})
  }
  
  async findById(id: string): Promise<ScheduleCongress | undefined> {
    const schedule = await this.ormRepository.findOne(id);
    return schedule;
  }
  async save(data: ScheduleCongress): Promise<ScheduleCongress> {
    return this.ormRepository.save(data);
  }
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }
  
  async list({owner_id}: IFindScheduleDTO): Promise<ScheduleCongress[]> {
    return await this.ormRepository.find({
      where: {
        owner_id
      },
      order: {
        created_at: 'DESC'
      }
    })

  }
  async create(data: ICreateScheduleCongressDTO): Promise<ScheduleCongress> {
    const schedule = this.ormRepository.create(data)
    return await this.ormRepository.save(schedule)
  }
}

export { SchedulesCongressRepositoryMongo }