import { ISchedulesRepository } from "../repositories/ISchedulesRepository";


class DeleteScheduleService {
  constructor(private repository: ISchedulesRepository) {}

  async execute(id: string) {
    const findSchedule = await this.repository.findById(id);
    if(!findSchedule) {
      throw new Error('Schedule not found!')
    }
    await this.repository.delete(id)
  }
}

export { DeleteScheduleService }