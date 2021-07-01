import { ITag } from "../model/ITag";

interface ICreateTagDTO {
  name: string;
  schedule_id: string;
}


interface ITagsRepository {
  findBySchedule(schedule_id: string): Promise<ITag[]>
  findById(id: string | any): Promise<ITag | undefined>
  list(): Promise<ITag[]>
  create(data: ICreateTagDTO): Promise<ITag>
  createMany(data: ICreateTagDTO[]): Promise<ITag[]>
  save(data: ITag): Promise<ITag>
  delete(id: string): Promise<void>
}

export { ITagsRepository, ICreateTagDTO }