import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ISchedule } from "../model/ISchedule";
import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository";
import qs from 'qs'
import { format } from 'date-fns'
import { IItemsJobCongressRepository } from "../repositories/IItemsJobCongressRepository";

interface IRequest {
  schedule:ISchedule,
}

class RunJobCongressService {
  constructor(
    private repository: IJobsCongressRepository,
    private itemsJobCongress: IItemsJobCongressRepository
    ){}


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
      }
      return await this.repository.create(job)
    }

    const api = axios.create(defaultConfig)
    const { data } = await api.get('proposicoes', {
      params: {
        dataApresentacaoInicio: initialDate,
        dataApresentacaoFim: finishDate,
        keywords: schedule.tags.map(tag => tag.name)
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {indices: false})
      }
    })

    const job = {
      date_job: new Date(),
      schedule_id: schedule.id,
    }
    const createdJob = await this.repository.create(job)

    const items = data.dados.map(item => ({
      proposition_id: item.id,
      date_apresentation: null,
      type_proposition: '',
      text: item.ementa,
      author: '',
      link: '',
      status: '',
      job_congress_id: createdJob.id
    }))

    await this.itemsJobCongress.createMany(items)

    return await this.repository.create(createdJob)

  }
}

export { RunJobCongressService }