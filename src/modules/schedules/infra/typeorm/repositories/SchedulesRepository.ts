import { ISchedule } from '../../../model/ISchedule';
import { ICreateScheduleDTO, ISchedulesRepository } from '../../../repositories/ISchedulesRepository';
import { getRepository, Repository } from 'typeorm'
import { Schedule } from '../entities/Schedule';

class SchedulesRepository implements ISchedulesRepository {
  private ormRepository: Repository<Schedule>

  constructor() {
    this.ormRepository = getRepository(Schedule)
  }
  async findByTypeSchedule(type_schedule: string): Promise<ISchedule[]> {
    return await this.ormRepository.find({type_schedule})
  }
  async findByTitle(title: string): Promise<ISchedule> {
    return await this.ormRepository.findOne({title})
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
  
  async list(): Promise<Schedule[]> {
    const schedules = await this.ormRepository.find()
    return schedules;
  }
  async create(data: ICreateScheduleDTO): Promise<Schedule> {
    const schedule = this.ormRepository.create(data)
    await this.ormRepository.save(schedule)
    return schedule
  }

}

export { SchedulesRepository }