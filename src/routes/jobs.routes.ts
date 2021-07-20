import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
import { FindScheduleCongressService } from '../modules/schedules/services/FindScheduleCongressService'
import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'
import { Router, Request, Response } from 'express'
import { JobsCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepositoryMongo'

const jobsRoutes = Router()

jobsRoutes.get('/schedule/:schedule_id', async (request: Request, response: Response) => {
  const { schedule_id } = request.params
  const repository = new JobsCongressRepositoryMongo()
  const job = await repository.findByScheduleId(schedule_id)
  return response.json(job)
})

jobsRoutes.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const repository = new JobsCongressRepositoryMongo()
  const job = await repository.findById(id)
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
  const jobs = await repository.list()
  return response.json(jobs)
})

// jobsRoutes.post('', async (request: Request, response: Response) => {
//   const { schedule_id } = request.body;

//   const repository = new JobsCongressRepositoryMongo()
//   const job = await repository.create({
//     date_job: new Date(),
//     schedule_id,
//     items: [
//       {proposition_id: 1242, text: 'alkjasdfkl'},
//       {proposition_id: 1243, text: 'alkjasdfkl'},
//       {proposition_id: 1244, text: 'alkjasdfkl'},
//       {proposition_id: 1245, text: 'alkjasdfkl'},
//       {proposition_id: 1244, text: 'alkjasdfkl'},
//       {proposition_id: 1246, text: 'alkjasdfkl'},
//       {proposition_id: 1245, text: 'alkjasdfkl'},
//       {proposition_id: 1247, text: 'alkjasdfkl'},
//     ]
//   })
//   return response.json(job)
// })

export { jobsRoutes }