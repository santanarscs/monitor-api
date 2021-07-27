import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
import { FindScheduleCongressService } from '../modules/schedules/services/FindScheduleCongressService'
import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'
import { Router, Request, Response } from 'express'
import { JobsCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepositoryMongo'
import { ListJobsByScheduleCongressService } from '../modules/schedules/services/ListJobsByScheduleCongressService'
import { FindJobCongressService } from '../modules/schedules/services/FindJobCongressService'
import { ListJobsCongressService } from '../modules/schedules/services/ListJobsCongressService'
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns'

import { CreateReportJobCongressService } from '../modules/schedules/services/CreateReportJobCongressService'
const jobsRoutes = Router()

jobsRoutes.get('/schedule/:schedule_id', async (request: Request, response: Response) => {
  const { schedule_id } = request.params
  
  const repository = new JobsCongressRepositoryMongo()
  const listJobsByScheduleCongressService = new ListJobsByScheduleCongressService(repository)
  
  const jobs = await listJobsByScheduleCongressService.execute(schedule_id)
  
  return response.json(jobs)
})

jobsRoutes.post('/:id/report', async(request: Request, response:Response) => {
  const {id} = request.params
  const { filterData } = request.body
  const repository = new JobsCongressRepositoryMongo()
  const findJobCongressService = new FindJobCongressService(repository)
  const job = await findJobCongressService.execute(id)

  // aplicar filtros

  let partialItems: any[] = []
  if(filterData.type_proposition?.length) {
    filterData.type_proposition.forEach((type: any) => {
      const filteredItem = job.items.filter(job => job.type_proposition === type.value)
      partialItems.push(...filteredItem)
    })
  }
  if(filterData.status?.length) {
    filterData.status.forEach((status: any) => {
      const filteredItem = job.items.filter(job => job.status === status.value)
      partialItems.push(...filteredItem)
    })
  }
  if(filterData.author?.length) {
    filterData.status.forEach((author: any) => {
      const filteredItem = job.items.filter(job => job.author === author.value)
      partialItems.push(...filteredItem)
    })
  }
  const finalItems =  partialItems.length
  ? partialItems.filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.text === item.text
    ))
    ).sort((first: any, next: any) => {
      if(first.type_proposition > next.type_proposition){
        return 1
      }
      if(first.type_proposition < next.type_proposition){
        return -1
      }
      return 0
    })
  : job.items.sort((first: any, next: any) => {
      if(first.type_proposition > next.type_proposition){
        return 1
      }
      if(first.type_proposition < next.type_proposition){
        return -1
      }
      return 0
    })

  const createReportJobCongressService = new CreateReportJobCongressService()
  const pdfDoc = await createReportJobCongressService.execute({
    job,
    items: finalItems,
  })

  const chunks: any = []
  
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk)
  })
  pdfDoc.end()

  pdfDoc.on('end', async () => {
    const result = Buffer.concat(chunks)
    response.end(result)
  })
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

  let initialDate = format(new Date(), 'yyyy-MM-dd')
  let finishDate = format(new Date(), 'yyyy-MM-dd')
  
  if(schedule.type_schedule === 'weekly') {
    initialDate = format(startOfWeek(new Date()), 'yyyy-MM-dd')
    finishDate = format(endOfWeek(new Date()), 'yyyy-MM-dd')
  }
  if(schedule.type_schedule === 'monthly') {
    initialDate = format(startOfMonth(new Date()), 'yyyy-MM-dd')
    finishDate = format(endOfMonth(new Date()), 'yyyy-MM-dd')
  }

  const jobs = await runJobCongressService.execute({schedule, initialDate, finishDate, origin: 'manual'})

  return response.json(jobs)

})

jobsRoutes.get('', async (request: Request, response: Response) => {
  const repository = new JobsCongressRepositoryMongo()
  
  const listJobsCongressService = new ListJobsCongressService(repository)
  const jobs = await listJobsCongressService.execute()
  
  return response.json(jobs)
})

export { jobsRoutes }