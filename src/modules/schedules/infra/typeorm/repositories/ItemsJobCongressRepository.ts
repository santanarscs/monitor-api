import { IItemsJobCongressRepository, ICreateItemJobCongressDTO } from "../../../repositories/IItemsJobCongressRepository"
import { getRepository, Repository } from "typeorm"
import { ItemJobCongress } from "../entities/ItemJobCongress"


class ItemsJobCongressRepository implements IItemsJobCongressRepository {
  private ormRepositry: Repository<ItemJobCongress>
  constructor() {
    this.ormRepositry = getRepository(ItemJobCongress)
  }
  async findById(id: string): Promise<ItemJobCongress> {
    return await this.ormRepositry.findOne(id)
  }
  async list(): Promise<ItemJobCongress[]> {
    return await this.ormRepositry.find()
  }
  async create(data: ICreateItemJobCongressDTO): Promise<ItemJobCongress> {
    const item = this.ormRepositry.create(data)
    await this.ormRepositry.save(item)
    return item
  }
  async createMany(data: ICreateItemJobCongressDTO[]): Promise<ItemJobCongress[]> {
    const items = this.ormRepositry.create(data)
    await this.ormRepositry.save(items)
    return items
  }
  async save(data: ItemJobCongress): Promise<ItemJobCongress> {
    return await this.ormRepositry.save(data)
  }
  async delete(id: string): Promise<void> {
    await this.ormRepositry.delete(id)
  }
}

export { ItemsJobCongressRepository }