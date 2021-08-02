import axios, { AxiosRequestConfig } from "axios"
import { HttpsProxyAgent } from "https-proxy-agent"
import qs from 'qs'


class DetailRepresentativeService {
  constructor(){}

  async execute(id: string) {
    
    const defaultConfig: AxiosRequestConfig = {
      baseURL: 'https://dadosabertos.camara.leg.br/api/v2',
      proxy: false,
      httpsAgent: process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null
    }

    const api = axios.create(defaultConfig)
    const { data: representative } = await api.get(`deputados/${id}`)

    // const {data: propositions} = await api.get('proposicoes', {
    //   params: {
    //     idDeputadoAutor: id
    //   }
    // })

    return {
      profile: representative.dados,
      propositions: []
    };
  }
}

export { DetailRepresentativeService }