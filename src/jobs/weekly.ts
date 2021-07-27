import * as cron from 'node-cron'
import { format, startOfWeek, subDays, endOfWeek } from 'date-fns'
import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'
import { resolve } from 'path'
import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
import { JobsCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepositoryMongo'

import { CreateReportJobCongressService } from '../modules/schedules/services/CreateReportJobCongressService'
import { EtherealMailProvider } from '../providers/MailProvider/implementations/EtherealMailProvider'
import { HandlebarsMailTemplateProvider } from '../providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'

import {getTokenKeycloak, getUsers} from './utils'

/**
/**
   * 1. buscar todos os agendamentos diarios
   * 2. realizar um request do dia
   * 3. iterar sobre array de agendamentos buscando por termos 
   * 4. Agregar mais valor non registro que foi encontnrato
   * 5. salvar na base de dados 
   * 6. enviar e-mail
*/

cron.schedule('0 7 * * 5', async () => {
  console.log('iniciando processo semanal!!')

  const token = await getTokenKeycloak()

  const users = await getUsers(token)

  const initialDate = format(startOfWeek(subDays(new Date, 7)), 'yyyy-MM-dd')
  const finishDate = format(endOfWeek(subDays(new Date, 7)), 'yyyy-MM-dd')
  const schedulesCongressRepository = new SchedulesCongressRepositoryMongo()
  const jobsCongressRepository = new JobsCongressRepositoryMongo()
  const runJobCongressService = new RunJobCongressService(jobsCongressRepository)
  const createReportService = new CreateReportJobCongressService()
  const mailTemplateProvider = new HandlebarsMailTemplateProvider()
  const mailProvider = new EtherealMailProvider(mailTemplateProvider)
  const schedules = await schedulesCongressRepository.findByTypeSchedule('monthly')

  if(!schedules) return;
  await Promise.all(
    schedules.map(async (schedule) => {

      const createdJob = await runJobCongressService.execute({
        schedule,
        initialDate,
        finishDate,
        origin: 'schedule'
      })

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
          {filename: 'Relatorio_semanal_camara_deptuados', content: result }
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