import { SchedulesRepository } from '../modules/congress/infra/typeorm/repositories/SchedulesRepository'
import { FindScheduleService } from '../modules/congress/services/FindScheduleService'
import { RunJobService } from '../modules/congress/services/RunJobService'
import { Router, Request, Response } from 'express'
import { JobsRepository } from '../modules/congress/infra/typeorm/repositories/JobsRepository'
import { ListJobsByScheduleService } from '../modules/congress/services/ListJobsByScheduleService'
import { FindJobService } from '../modules/congress/services/FindJobService'
import { ListJobsService } from '../modules/congress/services/ListJobsService'
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns'

import { CreateReportJobService } from '../modules/congress/services/CreateReportJobService'
const jobsRoutes = Router()

jobsRoutes.get('/schedule/:schedule_id', async (request: Request, response: Response) => {
  const { schedule_id } = request.params
  
  const repository = new JobsRepository()
  const listJobsByScheduleService = new ListJobsByScheduleService(repository)
  
  const jobs = await listJobsByScheduleService.execute(schedule_id)
  
  return response.json(jobs)
})

jobsRoutes.post('/:id/report', async(request: Request, response:Response) => {
  const {id} = request.params
  const { filterData } = request.body
  const repository = new JobsRepository()
  const findJobService = new FindJobService(repository)
  const job = await findJobService.execute(id)

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

  const createReportJobService = new CreateReportJobService()
  const pdfDoc = await createReportJobService.execute({
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
  
  const repository = new JobsRepository()
  const findJobService = new FindJobService(repository)
  
  const job = await findJobService.execute(id)
  
  return response.json(job)
})

jobsRoutes.post('/run', async (request: Request, response: Response) => {
  const { schedule_id } = request.body
  const schedulesRepository = new SchedulesRepository()
  const jobsRepository = new JobsRepository()

  const findScheduleService = new FindScheduleService(schedulesRepository)
  const schedule = await findScheduleService.execute(schedule_id)
  
  const runJobService = new RunJobService(jobsRepository)

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

  const jobs = await runJobService.execute({schedule, initialDate, finishDate, origin: 'manual'})

  return response.json(jobs)

})

jobsRoutes.get('', async (request: Request, response: Response) => {
  const repository = new JobsRepository()
  
  const listJobsService = new ListJobsService(repository)
  const jobs = await listJobsService.execute()
  
  return response.json(jobs)
})

export { jobsRoutes }