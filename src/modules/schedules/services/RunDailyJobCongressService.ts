/**
 * 1. Receber os agendamentos para o job 
 * 2. Realizar a buscar das proposições
 * 3. Salvar jobs na tabela
 * 4. Enviar email de atualização
 */

import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ISchedule } from "../model/ISchedule";
import qs from 'qs'
import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository";

class RunDailyJobCongressService {
  constructor(private jobCongressRepository: IJobsCongressRepository) {}


  async execute(schedules: ISchedule[]) {
    const today = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(new Date())

    const todayFormatted = today.split('/').reverse().join('-')

    const items = await Promise.all(
      schedules.map(async schedule => {
        const defaultConfig: AxiosRequestConfig = {
          baseURL: 'https://dadosabertos.camara.leg.br/api/v2',
          proxy: false,
          httpsAgent: new HttpsProxyAgent('http://10.1.101.101:8080')
        }
        if(!schedule.tags) {
          return {
            date_job: new Date(),
            tags: schedule.tags || [],
            owner_id: schedule.owner_id,
            type_job: schedule.repeat,
            items: []
          }
        }
      
        const api = axios.create(defaultConfig)
        const { data } = await api.get('proposicoes', 
          {
            params: {
              dataApresentacaoInicio: todayFormatted,
              dataApresentacaoFim: todayFormatted,
              keywords: schedule.tags
            },
            paramsSerializer: (params) => {
              return qs.stringify(params, {indices: false})
            }
          }
        )
        return {
          date_job: new Date(),
          tags: schedule.tags,
          owner_id: schedule.owner_id,
          type_job: schedule.repeat,

          items: data.dados.map(item => ({
            proposition_id: item.id,
            date_apresentation: today,
            text: item.ementa,
            author: '',
            link: '',
            status: ''
          }))
        }
      })
    )
    const jobs = await this.jobCongressRepository.createMany(items)
    return jobs;
  }
}

export { RunDailyJobCongressService }



 