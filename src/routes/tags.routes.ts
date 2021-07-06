import { Router, Request, Response } from 'express'
import { TagsRepository } from '../modules/schedules/infra/typeorm/repositories/TagsRepository'
import { DeleteTagService } from '../modules/schedules/services/DeleteTagService'

const tagsRoutes = Router()

tagsRoutes.delete('/:id', async (request: Request, response: Response) => {
  const tagsRepository = new TagsRepository()
  const deleteTagService = new DeleteTagService(tagsRepository)

  const { id } = request.params;

  await deleteTagService.execute(id)
  
  return response.status(201).send()
})

export { tagsRoutes }