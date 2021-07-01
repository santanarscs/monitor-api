import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ISchedule } from "../model/ISchedule";
import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository";
import qs from 'qs'
import { format } from 'date-fns'
interface IRequest {
  schedule:ISchedule,
}


class RunJobCongressService {
  constructor(private repository: IJobsCongressRepository){}


  private defineRangeDate(type_schedule: string): {initialDate: string, finishDate: string} {
    let initialDate = format(new Date(), 'yyyy-MM-dd')
    let finishDate = format(new Date(), 'yyyy-MM-dd')
    
    if(type_schedule === 'weekly') {

    }
    if(type_schedule === 'monthly') {

    }

    return {
      initialDate,
      finishDate,
    }
  }

  async execute({schedule}: IRequest) {
    
    const { initialDate, finishDate } = this.defineRangeDate(schedule.type_schedule)

    const defaultConfig: AxiosRequestConfig = {
      baseURL: 'https://dadosabertos.camara.leg.br/api/v2',
      proxy: false,
      httpsAgent: process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null
    }
    if(!schedule.tags) {
      const job = {
        date_job: new Date(),
        schedule_id: schedule.id,
        items: []
      }
      return await this.repository.create(job)
    }

    const api = axios.create(defaultConfig)
    const { data } = await api.get('proposicoes', {
      params: {
        dataApresentacaoInicio: initialDate,
        dataApresentacaoFim: finishDate,
        keywords: schedule.tags
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {indices: false})
      }
    })

    const job = {
      date_job: new Date(),
      schedule_id: schedule.id,
      items: data.dados.map(item => ({
        proposition_id: item.id,
        date_apresentation: '',
        text: item.ementa,
        author: '',
        link: '',
        status: ''
      }))
    }
    return await this.repository.create(job)

  }
}

export { RunJobCongressService }