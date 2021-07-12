import { ListRepresentativesService } from '../modules/schedules/services/ListRepresentativesService'
import { Router, Request, Response } from 'express'

const representativesRoutes = Router()

representativesRoutes.get('/', async (request: Request, response: Response) => {
  const listRepresentativesService = new ListRepresentativesService()
  const {representatives, totalCount} = await listRepresentativesService.execute(1)


  return response.status(200).json(representatives)
})

export { representativesRoutes }