import { ListRepresentativesService } from '../modules/schedules/services/ListRepresentativesService'
import { Router, Request, Response } from 'express'
import { DetailRepresentativeService } from '../modules/schedules/services/DetailRepresentativeService'

const representativesRoutes = Router()

representativesRoutes.get('/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const detailRepresentativeService = new DetailRepresentativeService()
  const representative = await detailRepresentativeService.execute(id)

  return response.status(200).json(representative)
})

representativesRoutes.get('/', async (request: Request, response: Response) => {
  const { page, limit, name } = request.query
  const listRepresentativesService = new ListRepresentativesService()
  const {representatives, totalCount} = await listRepresentativesService.execute({
    page: Number(page),
    limit: Number(limit),
    name: name ? String(name) : undefined,
  })

  response.header('x-total-count', String(totalCount));
  return response.status(200).json(representatives)
})

export { representativesRoutes }