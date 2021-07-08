import { SchedulesRepository } from '../modules/schedules/infra/typeorm/repositories/SchedulesRepository'
import { ListSchedulesByTypeService } from '../modules/schedules/services/ListSchedulesByTypeService'
import * as cron from 'node-cron'

import { RunJobCongressService } from '../modules/schedules/services/RunJobCongressService'
import { JobsCongressRepository } from '../modules/schedules/infra/typeorm/repositories/JobsCongressRepository'
import { ItemsJobCongressRepository } from '../modules/schedules/infra/typeorm/repositories/ItemsJobCongressRepository'
/**
   * 1. buscar todos os agendamentos diarios
   * 2. realizar um request do dia
   * 3. iterar sobre array de agendamentos buscando por termos 
   * 4. Agregar mais valor non registro que foi encontnrato
   * 5. salvar na base de dados 
   * 6. enviar e-mail
*/


cron.schedule('0 17 * * 5', async () => {
  console.log('iniciando processo!!')
  const schedulesRepository = new SchedulesRepository()
  const jobsCongressRepository = new JobsCongressRepository()
  const itemsJobsCongressRepository = new ItemsJobCongressRepository()
  const listScheduleByTypeScheduleService = new ListSchedulesByTypeService(schedulesRepository)
  const runJobCongress = new RunJobCongressService(jobsCongressRepository, itemsJobsCongressRepository)
  const schedules = await listScheduleByTypeScheduleService.execute('weekly')
  if(schedules){
    await Promise.all(
      schedules.map(async (schedule) => {
        if(schedule.target === 'camara_deputados') {
          await runJobCongress.execute({schedule})
        }
      })
    )
  }
  
}, {
  scheduled: true,
  timezone: 'America/Sao_Paulo'
})