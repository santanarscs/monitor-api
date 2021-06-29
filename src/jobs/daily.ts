import { SchedulesRepository } from '../modules/schedules/infra/typeorm/repositories/SchedulesRepository'
import { ListSchedulesByRepeatService } from '../modules/schedules/services/ListSchedulesByRepeatService'
import * as cron from 'node-cron'
import axios from 'axios'
/**
   * 1. buscar todos os agendamentos diarios
   * 2. realizar um request do dia
   * 3. iterar sobre array de agendamentos buscando por termos 
   * 4. Agregar mais valor non registro que foi encontnrato
   * 5. salvar na base de dados 
   * 6. enviar e-mail
*/


cron.schedule('* * * * *', async () => {
  const schedulesRepository = new SchedulesRepository()
  const listScheduleByRepeatService = new ListSchedulesByRepeatService(schedulesRepository)

  const schedules = await listScheduleByRepeatService.execute('daily')
  
  const data = axios.get('https://dadosabertos.camara.leg.br/api/v2/proposicoes', {
    params: {
      keywords: ''
    }
  })


  console.log(schedules)
})