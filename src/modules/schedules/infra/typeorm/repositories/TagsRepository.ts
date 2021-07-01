import { ICreateTagDTO, ITagsRepository } from "../../../repositories/ITagsRepository";
import { getRepository, Repository } from "typeorm";
import { Tag } from "../entities/Tag";


class TagsRepository implements ITagsRepository {

  private ormRepository: Repository<Tag>

  constructor() {
    this.ormRepository = getRepository(Tag)
  }

  async findBySchedule(schedule_id: string): Promise<Tag[]> {
    return await this.ormRepository.find({schedule_id})
  }
  async findById(id: string): Promise<Tag> {
    return await this.ormRepository.findOne(id)
  }
  async list(): Promise<Tag[]> {
    return await this.ormRepository.find()
  }
  async create(data: ICreateTagDTO): Promise<Tag> {
    const tag = this.ormRepository.create(data)
    await this.ormRepository.save(tag)
    return tag
  }
  async createMany(data: ICreateTagDTO[]): Promise<Tag[]> {
    const tags = this.ormRepository.create(data)
    await this.ormRepository.save(tags)
    return tags
  }

  async save(data: Tag): Promise<Tag> {
    return await this.ormRepository.save(data)
  }
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id)
  }

}

export { TagsRepository }