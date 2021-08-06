import * as cron from 'node-cron'
import { startOfYesterday, format } from 'date-fns'
import { RunJobService } from '../modules/congress/services/RunJobService'
import { resolve } from 'path'
import { SchedulesRepository } from '../modules/congress/infra/typeorm/repositories/SchedulesRepository'
import { JobsRepository } from '../modules/congress/infra/typeorm/repositories/JobsRepository'

import { CreateReportJobService } from '../modules/congress/services/CreateReportJobService'
import { EtherealMailProvider } from '../providers/MailProvider/implementations/EtherealMailProvider'
import { HandlebarsMailTemplateProvider } from '../providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'

import {getTokenKeycloak, getUsers} from './utils'
/**
   * 1. buscar todos os agendamentos diarios
   * 2. realizar um request do dia
   * 3. iterar sobre array de agendamentos buscando por termos
   * 4. Agregar mais valor non registro que foi encontnrato
   * 5. salvar na base de dados
   * 6. enviar e-mail
*/
cron.schedule('0 7 * * *', async () => {
  console.log('iniciando processo diário!!')

  const token = await getTokenKeycloak()

  const users = await getUsers(token)

  const initialDate = format(startOfYesterday(), 'yyyy-MM-dd')
  const finishDate = format(startOfYesterday(), 'yyyy-MM-dd')
  const schedulesCongressRepository = new SchedulesRepository()
  const jobsCongressRepository = new JobsRepository()
  const runJobService = new RunJobService(jobsCongressRepository)
  const createReportService = new CreateReportJobService()
  const mailTemplateProvider = new HandlebarsMailTemplateProvider()
  const mailProvider = new EtherealMailProvider(mailTemplateProvider)
  const schedules = await schedulesCongressRepository.findByTypeSchedule('daily')
  if(!schedules) return;
  await Promise.all(
    schedules.map(async (schedule) => {

      const createdJob = await runJobService.execute({
        schedule,
        initialDate,
        finishDate,
        origin: 'schedule'
      })

      if(!createdJob.items.length) return

      const user = users.find((user: any) => user.id === schedule.owner_id)

      const pdfDoc = await createReportService.execute({
        job: createdJob,
        items: createdJob.items
      })

      const chunks: any = []

      pdfDoc.on("data", (chunk) => {
        chunks.push(chunk)
      })

      pdfDoc.end()

      pdfDoc.on('end', async () => {
        const result = Buffer.concat(chunks)
        const attachments = [
          {filename: 'Relatorio_diario_camara_deptuados.pdf', content: result }
        ]

        const file = resolve(
          __dirname,
          '..',
          'modules',
          'schedules',
          'views',
          'job_statistic.hbs',
        );

        await mailProvider.sendMail({
          subject: 'CIGEO',
          to: {
            name: user.firstName,
            email: user.email
          },
          templateData: {
            file,
            variables: {
              name: user.firstName
            }
          },
          attachments
        })

      })
    })
  )
}, {
  scheduled: true,
  timezone: 'America/Sao_Paulo'
})
