import { Router, Request, Response } from 'express'
import { SchedulesRepository } from '../modules/schedules/infra/typeorm/repositories/SchedulesRepository'
import { JobsCongressRepository } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepository'
import { ListSchedulesByTypeService } from '../modules/schedules/services/ListSchedulesByTypeService'
import { RunDailyJobCongressService } from '../modules/schedules/services/RunDailyJobCongressService'

const jobsRoutes = Router()

jobsRoutes.get('/daily', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const jobsCongressRepository = new JobsCongressRepository()
  
  const listScheduleByTypeScheduleService = new ListSchedulesByTypeService(schedulesRepository)
  const runDailyJobService = new RunDailyJobCongressService(jobsCongressRepository)
  
  const schedules = await listScheduleByTypeScheduleService.execute('daily')

  const activeSchedules = schedules.filter(schedule => schedule.active === true)
  
  const items = await runDailyJobService.execute(activeSchedules)
  
  return response.status(200).json(items)
})

export { jobsRoutes }