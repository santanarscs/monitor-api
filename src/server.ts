import express from 'express'
import { schedulesRoutes } from './routes/schedules.routes'

const app = express()

app.use(express.json())

app.use("/schedules", schedulesRoutes)

app.listen(3333, () => console.log('Server is running'))