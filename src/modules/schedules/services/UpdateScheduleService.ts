import { ISchedule } from "../model/ISchedule";
import { ISchedulesRepository } from "../repositories/ISchedulesRepository";
import { ITagsRepository } from "../repositories/ITagsRepository";

class IRequest {
  id: string;
  title: string;
  target: string;
  active: boolean;
  type_schedule: string;
  tags: string[]
}

class UpdateScheduleService {
  constructor(
    private repository: ISchedulesRepository,
    private tagsRepository: ITagsRepository
    ) {}

  async execute({id, title, active, type_schedule, tags, target }: IRequest): Promise<ISchedule> {
    const schedule = await this.repository.findById(id);

    if(!schedule) {
      throw new Error('Schedule not found')
    }

    

    Object.assign(schedule, {title, active, target, type_schedule})
    const updatedSchedule = await this.repository.save(schedule)

    const existTags = schedule.tags.map(tag => tag.name)

    const addTags = tags
      .filter(tag => !existTags.includes(tag))
      .filter((value, index, self) => self.indexOf(value) === index)
    
    if(addTags.length) {
      await this.tagsRepository.createMany(addTags.map(tag => ({
        name: tag,
        schedule_id: updatedSchedule.id
      })))
    }

    return updatedSchedule
  }
}

export { UpdateScheduleService }