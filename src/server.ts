import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import AppError from './AppError';
import { schedulesRoutes } from './routes/schedules.routes'
import { jobsRoutes } from './routes/jobs.routes';
import { representativesRoutes } from './routes/representatives.routes';
import uploadConfig from './config/upload'
import cors from 'cors'
import './database';

import './providers/MailProvider'

import './jobs/daily'
import './jobs/monthly'
import './jobs/weekly'

const app = express()
app.use(cors({
  exposedHeaders: ['x-total-count'],
}))
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use("/schedules", schedulesRoutes)

app.use('/jobs', jobsRoutes)

app.use('/representatives', representativesRoutes)



app.get('/', (request, response) => {
  return response.json({
    "Api Status": 'Online',
    "Api Version": process.env.API_VERSION
  })
})

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(process.env.API_PORT, () => console.log(`Server is running in ${process.env.NODE_ENV}`))