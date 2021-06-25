import {Request, Response } from 'express'
import CreateCourseService from './CreateScheduleService'

export function createSchedule(request: Request, response: Response) {
  CreateCourseService.execute({
    title: 'Titulo 001',
    owner_id: 'Raphael',
    terms: ['Termo 1'],
    repeat: 'daily'
  })
  return response.send()
}