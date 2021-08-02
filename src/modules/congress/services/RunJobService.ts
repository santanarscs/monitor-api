import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ICreateJobDTO, IJobsRepository } from "../repositories/IJobsRepository";
import qs from 'qs'
import { ISchedule } from "../model/ISchedule";
import { IItemJob } from "../model/IJob";

interface IRequest {
  schedule: ISchedule,
  initialDate: string;
  finishDate: string;
  origin: 'manual' | 'schedule'
}

class RunJobService {
  constructor(private repository: IJobsRepository){}

  async execute({schedule, initialDate, finishDate, origin}: IRequest) {
    
    const defaultConfig: AxiosRequestConfig = {
      baseURL: 'https://dadosabertos.camara.leg.br/api/v2',
      proxy: false,
      httpsAgent: process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null
    }
    const params = {
      dataApresentacaoInicio: initialDate,
      dataApresentacaoFim: finishDate,
    }

    if(schedule.tags) {
      Object.assign(params, {
        keywords: schedule.tags
      })
    }
    if(schedule.type_proposition) {
      Object.assign(params, {
        siglaTipo: schedule.type_proposition.map(type => type.value)
      })
    }

    const api = axios.create(defaultConfig)
    const { headers } = await api.get('proposicoes', {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, {indices: false})
      }
    })
    const totalHits = Math.floor(headers['x-total-count'] / 15) + 1

    let proposicoes = []
    for(let i = 1; i <= totalHits; i++) {
      const response = await api.get('proposicoes', {
        params: {
          ...params,
          'itens': 15,
          'pagina': i,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, {indices: false})
        }
      })
      const itens = await Promise.all(
        response.data.dados.map(async (item:any) => {
          const responseItem = await api.get(item.uri)
          const responseAutor = await api.get(responseItem.data.dados.uriAutores)

          return {
            ...item,
            ...responseItem.data.dados,
            autores: responseAutor.data.dados.map((autor: any) => autor.nome).join(',')
          }
        })
      )
      proposicoes.push(...itens)
    }

    const items: IItemJob[] = proposicoes.map((item: any) => ({
      proposition_id: item.id,
      date_apresentation: new Date(item.dataApresentacao),
      type_proposition: item.siglaTipo,
      text: item.ementa,
      author: item.autores,
      link: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${item.id}`,
      status: item.statusProposicao.descricaoTramitacao,
    }))
    
    const job: ICreateJobDTO = {
      date_job: new Date(),
      schedule_id: schedule.id,
      origin,
      items
    }
    const createdJob = await this.repository.create(job)

    return createdJob
  }
}

export { RunJobService }