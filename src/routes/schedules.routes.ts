import { FindScheduleService } from '../modules/congress/services/FindScheduleService'
import { Router, Request, Response } from 'express'
import { SchedulesRepository } from '../modules/congress/infra/typeorm/repositories/SchedulesRepository'
import { ListSchedulesService } from '../modules/congress/services/ListSchedulesService'
import { CreateScheduleService } from '../modules/congress/services/CreateScheduleService'
import { UpdateScheduleService } from '../modules/congress/services/UpdateScheduleService'
import { DeleteScheduleService } from '../modules/congress/services/DeleteScheduleService'
const schedulesRoutes = Router()

schedulesRoutes.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const repository = new SchedulesRepository()
  const findScheduleService = new FindScheduleService(repository)
  const schedule = await findScheduleService.execute(id)
  return response.status(200).json(schedule)
})

schedulesRoutes.get('', async (request: Request, response: Response) => {
  const{ owner_id } = request.query
  
  const repository = new SchedulesRepository()
  const listSchedulesService = new ListSchedulesService(repository)
  
  const schedules = await listSchedulesService.execute({
    owner_id: String(owner_id)
  })

  return response.status(200).json(schedules)
})

schedulesRoutes.post('', async (request: Request, response: Response) => {
  const {name, type_proposition, type_schedule, tags, owner_id, active } = request.body
  
  const repository = new SchedulesRepository()
  const createScheduleService = new CreateScheduleService(repository)
  
  const schedule = await createScheduleService.execute({name, type_proposition, type_schedule, tags, owner_id, active});
  
  return response.json(schedule)
})

schedulesRoutes.put('/:id', async (request: Request, response: Response) => {
  const {name, type_proposition, type_schedule, tags, active } = request.body
  const { id } = request.params
  
  const repository = new SchedulesRepository()
  const updateScheduleService = new UpdateScheduleService(repository)

  const updatedSchedule = await updateScheduleService.execute({id, name, type_proposition, type_schedule, tags, active});
  
  return response.json(updatedSchedule)
})

schedulesRoutes.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  
  const repository = new SchedulesRepository()
  const deleteScheduleService = new DeleteScheduleService(repository)
  
  await deleteScheduleService.execute(id);
  
  return response.send()
})

export { schedulesRoutes }