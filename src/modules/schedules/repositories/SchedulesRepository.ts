import { Schedule } from "../model/Schedule"
import { ICreateScheduleDTO, ISchedulesRepository } from "./ISchedulesRepository";




class SchedulesRepository implements ISchedulesRepository {
  
  private schedules: Schedule[]

  constructor() {
    this.schedules = []
  }

  create({title, owner_id}: ICreateScheduleDTO): void {
    const schedule = new Schedule();
    Object.assign(schedule, {
      title,
      owner_id
    })

    this.schedules.push(schedule)
  }

  list(): Schedule[] {
    return this.schedules;
  }
  findByTitle(title: string) {
    const schedule = this.schedules.find(schedule=> schedule.title === title)
    return schedule;
  }
}

export { SchedulesRepository }