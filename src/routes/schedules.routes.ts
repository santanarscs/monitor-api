import { FindScheduleCongressService } from '../modules/schedules/services/FindScheduleCongressService'
import { Router, Request, Response } from 'express'
import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
import { ListSchedulesCongressService } from '../modules/schedules/services/ListSchedulesCongressService'
import { CreateScheduleCongressService } from '../modules/schedules/services/CreateScheduleCongressService'
import { UpdateScheduleCongressService } from '../modules/schedules/services/UpdateScheduleCongressService'
import { DeleteScheduleCongressService } from '../modules/schedules/services/DeleteScheduleCongressService'
const schedulesRoutes = Router()

schedulesRoutes.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const repository = new SchedulesCongressRepositoryMongo()
  const findScheduleCongressService = new FindScheduleCongressService(repository)
  const schedule = await findScheduleCongressService.execute(id)
  return response.status(200).json(schedule)
})

schedulesRoutes.get('', async (request: Request, response: Response) => {
  const{ owner_id } = request.query
  
  const repository = new SchedulesCongressRepositoryMongo()
  const listSchedulesCongressService = new ListSchedulesCongressService(repository)
  
  const schedules = await listSchedulesCongressService.execute({
    owner_id: String(owner_id)
  })

  return response.status(200).json(schedules)
})

schedulesRoutes.post('', async (request: Request, response: Response) => {
  const {name, type_proposition, type_schedule, tags, owner_id, active } = request.body
  
  const repository = new SchedulesCongressRepositoryMongo()
  const createScheduleCongressService = new CreateScheduleCongressService(repository)
  
  const schedule = await createScheduleCongressService.execute({name, type_proposition, type_schedule, tags, owner_id, active});
  
  return response.json(schedule)
})

schedulesRoutes.put('/:id', async (request: Request, response: Response) => {
  const {name, type_proposition, type_schedule, tags, active } = request.body
  const { id } = request.params
  
  const repository = new SchedulesCongressRepositoryMongo()
  const updateScheduleCongressService = new UpdateScheduleCongressService(repository)

  const updatedSchedule = await updateScheduleCongressService.execute({id, name, type_proposition, type_schedule, tags, active});
  
  return response.json(updatedSchedule)
})

schedulesRoutes.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  
  const repository = new SchedulesCongressRepositoryMongo()
  const deleteScheduleCongressService = new DeleteScheduleCongressService(repository)
  
  await deleteScheduleCongressService.execute(id);
  
  return response.send()
})

export { schedulesRoutes }