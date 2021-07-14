import axios, { AxiosRequestConfig } from "axios"
import { HttpsProxyAgent } from "https-proxy-agent"
import qs from 'qs'
interface IRequest {
  page?: number;
  limit?: number;
  name?: string;
}

class ListRepresentativesService {
  constructor(){}

  async execute({page, limit, name}: IRequest): Promise<{representatives: any, totalCount: number}> {
    
    const defaultConfig: AxiosRequestConfig = {
      baseURL: 'https://dadosabertos.camara.leg.br/api/v2',
      proxy: false,
      httpsAgent: process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null
    }

    let params = {
      'pagina': page,
      'itens': limit
    }

    if(name) {
      Object.assign(params, {nome: name})
    }
    
    const api = axios.create(defaultConfig)
    const { data, headers } = await api.get('deputados', {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, {indices: false})
      }
    })

    return {
      representatives: data.dados,
      totalCount: headers['x-total-count']
    };
  }
}

export { ListRepresentativesService }