import { ISchedulesRepository } from "../repositories/ISchedulesRepository";

class ListSchedulesByRepeatService {
  constructor(private repository: ISchedulesRepository){}

  async execute(repeat: string) {
    return await this.repository.findByRepeat(repeat)
  }
}

export { ListSchedulesByRepeatService }