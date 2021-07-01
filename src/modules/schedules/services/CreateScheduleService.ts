import { ISchedule } from "../model/ISchedule";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository"
import { ITagsRepository } from "../repositories/ITagsRepository";

interface IRequest {
  title: string;
  target: string;
  owner_id: string;
  type_schedule: string;
  tags: string[]
}

class CreateScheduleService {

  constructor(
    private schedulesRepository: ISchedulesRepository,
    private tagsRepository: ITagsRepository
    ) {
    
  }

  async execute({title, target, owner_id, type_schedule, tags}: IRequest): Promise<ISchedule> {
        
    const scheduleAlreadyExists = await this.schedulesRepository.findByTitle(title)

    if(scheduleAlreadyExists) {
      throw new Error("Schedule Already exists!")
    }

    const schedule = await this.schedulesRepository.create({title, target, owner_id, type_schedule })
    
    const existsTags = await this.tagsRepository.findBySchedule(schedule.id)

    const existsTagsTitle = existsTags.map(tag => tag.name)

    const addTags = tags
      .filter(tag => !existsTagsTitle.includes(tag))
      .filter((value, index, self) => self.indexOf(value) === index)

    await this.tagsRepository.create(addTags.map(tag => ({
      name: tag,
      schedule_id: schedule.id
    })))

    return schedule;
  }
}

export { CreateScheduleService }