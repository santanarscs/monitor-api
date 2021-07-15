import axios, { AxiosRequestConfig } from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { ISchedule } from "../model/ISchedule";
import { IJobsCongressRepository } from "../repositories/IJobsCongressRepository";
import qs from 'qs'
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns'
import { IItemsJobCongressRepository } from "../repositories/IItemsJobCongressRepository";
import { IMailProvider } from "../../../providers/MailProvider/models/IMailProvider";
import path from 'path';
interface IRequest {
  schedule:ISchedule,
}

class RunJobCongressService {
  constructor(
    private repository: IJobsCongressRepository,
    private itemsJobCongress: IItemsJobCongressRepository,
    private mailProvider: IMailProvider
    ){}


  private defineRangeDate(type_schedule: string): {initialDate: string, finishDate: string} {
    let initialDate = format(new Date(), 'yyyy-MM-dd')
    let finishDate = format(new Date(), 'yyyy-MM-dd')
    
    if(type_schedule === 'weekly') {
      initialDate = format(startOfWeek(new Date()), 'yyyy-MM-dd')
      finishDate = format(endOfWeek(new Date()), 'yyyy-MM-dd')
    }
    if(type_schedule === 'monthly') {
      initialDate = format(startOfMonth(new Date()), 'yyyy-MM-dd')
      finishDate = format(endOfMonth(new Date()), 'yyyy-MM-dd')
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
    const params = {
      dataApresentacaoInicio: initialDate,
      dataApresentacaoFim: finishDate,
    }

    if(schedule.tags) {
      Object.assign(params, {
        keywords: schedule.tags.map(tag => tag.name)
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
    
    const job = {
      date_job: new Date(),
      schedule_id: schedule.id,
    }
    const createdJob = await this.repository.create(job)

    const items = proposicoes.map((item: any) => ({
      proposition_id: item.id,
      date_apresentation: new Date(item.dataApresentacao),
      type_proposition: item.siglaTipo,
      text: item.ementa,
      author: item.autores,
      link: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${item.id}`,
      status: item.statusProposicao.descricaoTramitacao,
      job_congress_id: createdJob.id
    }))
    await this.itemsJobCongress.createMany(items)

    const file = path.resolve(
      __dirname,
      '..',
      'views',
      'job_statistic.hbs',
    );

    await this.mailProvider.sendMail({
      subject: "CIGEO",
      to: {
        email: 'raphael.santana@presidencia.gov.br',
        name: 'Raphael Santana'
      },
      templateData: {
        file,
        variables: {
          createdJob,
          items
        }
      }
    })

    return await this.repository.create(createdJob)

  }
}

export { RunJobCongressService }