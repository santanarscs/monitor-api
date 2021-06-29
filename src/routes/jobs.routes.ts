import axios from 'axios'
import { Router, Request, Response } from 'express'
import { SchedulesRepository } from '../modules/schedules/infra/typeorm/repositories/SchedulesRepository'
import { ListSchedulesByRepeatService } from '../modules/schedules/services/ListSchedulesByRepeatService'
import qs from 'qs'
const jobsRoutes = Router()

jobsRoutes.get('/', async (request: Request, response: Response) => {
  const schedulesRepository = new SchedulesRepository()
  const listScheduleByRepeatService = new ListSchedulesByRepeatService(schedulesRepository)

  const schedules = await listScheduleByRepeatService.execute('daily')

  const activeSchedules = schedules.filter(schedule => schedule.active === true)

  const items = await Promise.all(
    activeSchedules.map(async schedule => {
      const {data} = await axios.get('https://dadosabertos.camara.leg.br/api/v2/proposicoes', {
        params: {
          keywords: schedule.tags,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, {indices: false})
        }
      })
      return {
        ...schedule,
        data
      }
    })
  )

  // const metadatas = activeSchedules.map(async schedule => {
    
  //   return {
  //     ...schedule,
  //     history: data
  //   }
  // })
  // const { data } = await axios.get('https://dadosabertos.camara.leg.br/api/v2/proposicoes', {
  //   params: {
  //     dataInicio: '2021-05-01',
  //     dataFim: '2021-05-31',
  //     itens: 100,
  //     keywords: ['mineração', 'defesa'],
  //   },
  //   paramsSerializer: (params) => {
  //     return qs.stringify(params, {indices: false})
  //   }
  // })

  return response.status(200).json(items)
})

export { jobsRoutes }