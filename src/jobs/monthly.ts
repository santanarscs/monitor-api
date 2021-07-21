import * as cron from 'node-cron'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'

import { SchedulesCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/SchedulesCongressRepositoryMongo'
import { JobsCongressRepositoryMongo } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepositoryMongo'
/**
   * 1. buscar todos os agendamentos diarios
   * 2. realizar um request do dia
   * 3. iterar sobre array de agendamentos buscando por termos 
   * 4. Agregar mais valor non registro que foi encontnrato
   * 5. salvar na base de dados 
   * 6. enviar e-mail
*/


cron.schedule('0 7 30 * *', async () => {
  console.log('iniciando processo mensal!!')
  const initialDate = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const finishDate = format(endOfMonth(new Date()), 'yyyy-MM-dd')
  const schedulesCongressRepository = new SchedulesCongressRepositoryMongo()
  const jobsCongressRepository = new JobsCongressRepositoryMongo()
  const runJobCongressService = new RunJobCongressService(jobsCongressRepository)

  const schedules = await schedulesCongressRepository.findByTypeSchedule('monthly')

  if(schedules) {
    await Promise.all(
      schedules.map(async (schedule) => {
        if(schedule.active) {
          await runJobCongressService.execute({
            schedule,
            initialDate,
            finishDate,
            origin: 'schedule'
          })
        }
      })
    )
  }
}, {
  scheduled: true,
  timezone: 'America/Sao_Paulo'
})