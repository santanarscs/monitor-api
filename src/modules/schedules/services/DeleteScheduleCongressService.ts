import { ISchedulesCongressRepository } from "../repositories/ISchedulesCongressRepository";


class DeleteScheduleCongressService {
  constructor(private repository: ISchedulesCongressRepository) {}

  async execute(id: string) {
    const findSchedule = await this.repository.findById(id);
    if(!findSchedule) {
      throw new Error('Schedule not found!')
    }
    await this.repository.delete(id)
  }
}

export { DeleteScheduleCongressService }