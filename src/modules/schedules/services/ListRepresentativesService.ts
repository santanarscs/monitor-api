import axios, { AxiosRequestConfig } from "axios"
import { HttpsProxyAgent } from "https-proxy-agent"
import qs from 'qs'

class ListRepresentativesService {
  constructor(){}

  async execute(page: number): Promise<{representatives: any, totalCount: number}> {
    
    const defaultConfig: AxiosRequestConfig = {
      baseURL: 'https://dadosabertos.camara.leg.br/api/v2',
      proxy: false,
      httpsAgent: process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null
    }
    
    const api = axios.create(defaultConfig)
    const { data, headers } = await api.get('deputados', {
      params: {
        'pagina': page,
        'itens': 20
      },
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