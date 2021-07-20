import { FindScheduleCongressService } from '../modules/schedules/services/FindScheduleCongressService'
import { Router, Request, Response } from 'express'
import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
const schedulesRoutes = Router()

schedulesRoutes.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const repository = new SchedulesCongressRepositoryMongo()
  const findScheduleCongressService = new FindScheduleCongressService(repository)
  const schedule = await findScheduleCongressService.execute(id)
  return response.status(200).json(schedule)
})

schedulesRoutes.get('', async (request: Request, response: Response) => {
  const repository = new SchedulesCongressRepositoryMongo()
  const{ owner_id } = request.query
  const schedules = await repository.list({
    owner_id: String(owner_id)
  })
  return response.status(200).json(schedules)
})

schedulesRoutes.post('', async (request: Request, response: Response) => {
  const {name, type_proposition, type_schedule, tags, owner_id, active } = request.body
  const repository = new SchedulesCongressRepositoryMongo()
  const schedule = await repository.create({name, type_proposition, type_schedule, tags, owner_id, active});
  return response.json(schedule)
})

schedulesRoutes.put('/:id', async (request: Request, response: Response) => {
  const {name, type_proposition, type_schedule, tags, active } = request.body
  const { id } = request.params
  const repository = new SchedulesCongressRepositoryMongo()
  const schedule = await repository.findById(id)

  if(!schedule) {
    return response.send()
  }
  const updatedSchedule = await repository.save({...schedule, name, type_proposition, type_schedule, tags, active});
  return response.json(updatedSchedule)
})

schedulesRoutes.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params;
  const repository = new SchedulesCongressRepositoryMongo()
  await repository.delete(id);
  return response.send()
})

export { schedulesRoutes }