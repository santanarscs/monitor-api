import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
import { FindScheduleCongressService } from '../modules/schedules/services/FindScheduleCongressService'
import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'
import { Router, Request, Response } from 'express'
import { JobsCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepositoryMongo'
import { ListJobsByScheduleCongressService } from '../modules/schedules/services/ListJobsByScheduleCongressService'
import { FindJobCongressService } from '../modules/schedules/services/FindJobCongressService'
import { ListJobsCongressService } from '../modules/schedules/services/ListJobsCongressService'
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns'

import PDFPrinter from 'pdfmake'
import { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces'

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

  let partialJob: any[] = []
  if(filterData.type_proposition?.length) {
    filterData.type_proposition.forEach((type: any) => {
      const filteredJob = job.items.filter(job => job.type_proposition === type.value)
      partialJob.push(...filteredJob)
    })
  }
  if(filterData.status?.length) {
    filterData.status.forEach((status: any) => {
      const filteredJob = job.items.filter(job => job.status === status.value)
      partialJob.push(...filteredJob)
    })
  }
  if(filterData.author?.length) {
    filterData.status.forEach((author: any) => {
      const filteredJob = job.items.filter(job => job.author === author.value)
      partialJob.push(...filteredJob)
    })
  }
  const finalJobs =  partialJob.length
  ? partialJob.filter((item, index, self) =>
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
  

  const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    },
  }
  const printer = new PDFPrinter(fonts)

  const body = []

  const columnsTitle: TableCell[] = [
    {text: 'NÚMERO', style: 'columnsTitle'},
    {text: 'TIPO', style: 'columnsTitle'},
    {text: 'APRESENTAÇÃO', style: 'columnsTitle'},
    {text: 'TEXTO', style: 'columnsTitle'},
    {text: 'STATUS', style: 'columnsTitle'},
    {text: 'AUTOR', style: 'columnsTitle'}
  ]

  const columnsBody =  new Array();
  columnsTitle.forEach(column => columnsBody.push(column))
  body.push(columnsTitle)

  for await (let item of finalJobs) {
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(item.date_apresentation))
    const row = new Array()

    row.push({text: item.proposition_id, link: item.link, color: 'blue', bold: true, nodeName: 'A', style: ["html-strong", "html-a", "html-p", 'columnBody']})
    row.push({text: item.type_proposition, style: 'columnBody'})
    row.push({text: formattedDate, style: 'columnBody'})
    row.push({text: item.text, style: 'columnBody'})
    row.push({text: item.status, style: 'columnBody'})
    row.push({text: item.author, style: 'columnBody'})
    body.push(row)
  }

  const dateJobFormatted = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(job.date_job))
  
  const today = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const docDefinitions: TDocumentDefinitions = {
    defaultStyle: {font: 'Helvetica'},
    pageOrientation: 'landscape',
    content: [
      {
        columns: [
          [
            {text: 'Relatório câmara dos deputados', bold: true, margin: [0,0,0,0], fontSize:16},
            {text: `Trabalho do dia ${dateJobFormatted}`, bold: true, margin: [0,5,0,10]},
          ],
          [
            {text: today, style: 'titlePage', alignment: 'right',margin: [0,0,0,0]},
            {text: `${finalJobs.length} Registros`, alignment: 'right', margin: [0,5,0,10]}
          ]
        ]
      },
      {
        table: {
          headerRows: 1,
          body
        },
      }
    ],
    styles: {
      header: {

      },
      columnsTitle: {
        fontSize: 8,
        bold: true,
        alignment: 'center',
        margin: [0, 5, 0, 10]
      },
      columnBody: {
        margin: [0, 5, 0, 0],
        lineHeight: 1.5
      }
    }
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinitions)
  const chunks: any = []
  
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk)
  })
  pdfDoc.end()

  pdfDoc.on('end', () => {
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