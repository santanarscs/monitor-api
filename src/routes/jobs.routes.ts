import { Router, Request, Response } from 'express'
import { SchedulesRepository } from '../modules/schedules/infra/typeorm/repositories/SchedulesRepository'
import { JobsCongressRepository } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepository'
import { ListSchedulesByRepeatService } from '../modules/schedules/services/ListSchedulesByRepeatService'
import { RunDailyJobCongressService } from '../modules/schedules/services/RunDailyJobCongressService'

const jobsRoutes = Router()

jobsRoutes.get('/daily', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const jobsCongressRepository = new JobsCongressRepository()
  
  const listScheduleByRepeatService = new ListSchedulesByRepeatService(schedulesRepository)
  const runDailyJobService = new RunDailyJobCongressService(jobsCongressRepository)
  
  const schedules = await listScheduleByRepeatService.execute('daily')

  const activeSchedules = schedules.filter(schedule => schedule.active === true)
  
  const items = await runDailyJobService.execute(activeSchedules)
  
  return response.status(200).json(items)
})

export { jobsRoutes }