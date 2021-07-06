import { ITagsRepository } from "../repositories/ITagsRepository";


class DeleteTagService {
  constructor(private repository: ITagsRepository) {}

  async execute(id: string) {
    const tag = await this.repository.findById(id)
    if(!tag) {
      throw new Error('Tag not found!')
    }
    await this.repository.delete(id)
  }
}

export { DeleteTagService }