import { Router, Request, Response } from 'express'
import { SchedulesRepository } from '../modules/schedules/repositories/SchedulesRepository'
import { CreateScheduleService } from '../modules/schedules/services/CreateScheduleService'

const schedulesRoutes = Router()
const schedulesRepository = new SchedulesRepository()

schedulesRoutes.post('/', (request: Request, response: Response) => {
  const { title, owner_id } = request.body

  const createScheduleService = new CreateScheduleService(schedulesRepository)

  createScheduleService.execute({title, owner_id})
  
  return response.status(201).json({ok: true})
})

schedulesRoutes.get('/', (request: Request, response: Response) => {
  const all = schedulesRepository.list()

  return response.status(200).json(all)
})

export { schedulesRoutes }