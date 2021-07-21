import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
import { FindScheduleCongressService } from '../modules/schedules/services/FindScheduleCongressService'
import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'
import { Router, Request, Response } from 'express'
import { JobsCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepositoryMongo'
import { ListJobsByScheduleCongressService } from '../modules/schedules/services/ListJobsByScheduleCongressService'
import { FindJobCongressService } from '../modules/schedules/services/FindJobCongressService'
import { ListJobsCongressService } from '../modules/schedules/services/ListJobsCongressService'

const jobsRoutes = Router()

jobsRoutes.get('/schedule/:schedule_id', async (request: Request, response: Response) => {
  const { schedule_id } = request.params
  
  const repository = new JobsCongressRepositoryMongo()
  const listJobsByScheduleCongressService = new ListJobsByScheduleCongressService(repository)
  
  const jobs = await listJobsByScheduleCongressService.execute(schedule_id)
  
  return response.json(jobs)
})

jobsRoutes.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  
  const repository = new JobsCongressRepositoryMongo()
  const findJobCongressService = new FindJobCongressService(repository)
  
  const job = await findJobCongressService.execute(id)
  
  return response.json(job)
})
jobsRoutes.post('/run', async (request: Request, response: Response) => {
  const { schedule_id } = request.body
  const schedulesCongressRepository = new SchedulesCongressRepositoryMongo()
  const jobsCongressRepository = new JobsCongressRepositoryMongo()

  const findScheduleService = new FindScheduleCongressService(schedulesCongressRepository)
  const schedule = await findScheduleService.execute(schedule_id)
  
  const runJobCongressService = new RunJobCongressService(jobsCongressRepository)

  const jobs = await runJobCongressService.execute({schedule})

  return response.json(jobs)

})

jobsRoutes.get('', async (request: Request, response: Response) => {
  const repository = new JobsCongressRepositoryMongo()
  
  const listJobsCongressService = new ListJobsCongressService(repository)
  const jobs = await listJobsCongressService.execute()
  
  return response.json(jobs)
})

export { jobsRoutes }