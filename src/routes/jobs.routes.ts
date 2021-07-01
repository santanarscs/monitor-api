import { Router, Request, Response } from 'express'
import { SchedulesRepository } from '../modules/schedules/infra/typeorm/repositories/SchedulesRepository'
import { JobsCongressRepository } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepository'
import { ListSchedulesByTypeService } from '../modules/schedules/services/ListSchedulesByTypeService'
import { RunDailyJobCongressService } from '../modules/schedules/services/RunDailyJobCongressService'
import { FindScheduleService } from '../modules/schedules/services/FindScheduleService'
import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'

import { ListJobsByScheduleService } from '../modules/schedules/services/ListJobsByScheduleService'

const jobsRoutes = Router()

jobsRoutes.post('/once', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const jobsCongressRepository = new JobsCongressRepository()
  
  const { schedule_id } = request.body
  const findScheduleService = new FindScheduleService(schedulesRepository)
  const schedule = await findScheduleService.execute(schedule_id)

  if(schedule.target === 'camara_deputados') {
    const runJobCongressService = new RunJobCongressService(jobsCongressRepository)
    const job = await runJobCongressService.execute({schedule})

    return response.status(200).json(job)
  }

  return response.status(304).send()
})

jobsRoutes.get('/daily', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const jobsCongressRepository = new JobsCongressRepository()
  
  const listScheduleByTypeScheduleService = new ListSchedulesByTypeService(schedulesRepository)
  const runDailyJobService = new RunDailyJobCongressService(jobsCongressRepository)
  
  const schedules = await listScheduleByTypeScheduleService.execute('daily')

  const activeSchedules = schedules.filter(schedule => schedule.active === true)
  
  const job = await runDailyJobService.execute(activeSchedules)
  
  return response.status(200).json(job)
})

jobsRoutes.get('/schedule/:schedule_id', async (request: Request, response: Response) => {
  const jobsCongressRepository = new JobsCongressRepository()
  const listJobsByScheduleIdService = new ListJobsByScheduleService(jobsCongressRepository)

  const { schedule_id } = request.params

  const jobs = await listJobsByScheduleIdService.execute(schedule_id)
  return response.status(200).json(jobs)
})

export { jobsRoutes }