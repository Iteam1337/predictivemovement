import express, { ErrorRequestHandler } from 'express'
import bodyParser from 'body-parser'
import routes from './routes'
import config from './config'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.json())

routes(app)

export const errorHandler: ErrorRequestHandler = (error, _req, _res, next) => {
  console.error(error.stack)
  next(error)
}

app.use(errorHandler)

app.use(express.static(config.publicPath))

app.listen(config.express, () => {
  console.log(`listening on port ${config.express.port}`)
})

export default app
