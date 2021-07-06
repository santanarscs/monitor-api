import { Router, Request, Response } from 'express'
import { DeleteScheduleService } from '../modules/schedules/services/DeleteScheduleService'
import { FindScheduleService } from '../modules/schedules/services/FindScheduleService'
import { UpdateScheduleService } from '../modules/schedules/services/UpdateScheduleService'
import { SchedulesRepository } from '../modules/schedules/infra/typeorm/repositories/SchedulesRepository'
import { CreateScheduleService } from '../modules/schedules/services/CreateScheduleService'
import { ListScheduleService } from '../modules/schedules/services/ListSchedulesService'
import { TagsRepository } from '../modules/schedules/infra/typeorm/repositories/TagsRepository'

const schedulesRoutes = Router()

schedulesRoutes.put('/:id', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const tagsRepository = new TagsRepository()
  const updateScheduleRepository = new UpdateScheduleService(schedulesRepository, tagsRepository)
  const { id } = request.params;
  const { title, target, tags, type_schedule, active } = request.body

  const schedule = await updateScheduleRepository.execute({id, title, target, tags, type_schedule, active})
  
  return response.status(201).json(schedule)
})

schedulesRoutes.delete('/:id', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const deleteScheduleService = new DeleteScheduleService(schedulesRepository)
  const { id } = request.params;

  await deleteScheduleService.execute(id)
  
  return response.status(201).send()
})

schedulesRoutes.get('/:id', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const findScheduleService = new FindScheduleService(schedulesRepository)
  const { id } = request.params
  
  const schedule = await findScheduleService.execute(id)

  return response.status(200).json(schedule)
})

schedulesRoutes.post('/', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const tagsRepository = new TagsRepository()
  const createScheduleService = new CreateScheduleService(schedulesRepository, tagsRepository)
  
  const { title, target, owner_id, tags, type_schedule } = request.body

  const schedule = await createScheduleService.execute({title, target, owner_id, tags, type_schedule})
  
  return response.status(201).json(schedule)
})

schedulesRoutes.get('/', async (request: Request, response: Response) => {

  const { page, limit, owner_id } = request.query

  const schedulesRepository = new SchedulesRepository()
  const listScheduleService = new ListScheduleService(schedulesRepository)

  const [schedules, total] = await listScheduleService.execute({
    page: Number(page),
    limit: Number(limit),
    owner_id: String(owner_id)
  })
  response.header('x-total-count', String(total));

  return response.status(200).json(schedules)
})

export { schedulesRoutes }