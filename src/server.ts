import 'reflect-metadata';
import express from 'express'

import { schedulesRoutes } from './routes/schedules.routes'
import { jobsRoutes } from './routes/jobs.routes';

import './database';
// import './jobs/daily'
const app = express()

app.use(express.json())

app.use("/schedules", schedulesRoutes)

app.use('/jobs', jobsRoutes)

app.listen(3333, () => console.log('Server is running'))