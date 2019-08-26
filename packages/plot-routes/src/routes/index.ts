import { Express } from 'express'
import { packageJSON, publicPath } from '../config'
import generate from './generate'

export default (app: Express) => {
  app.get('/', (_, res) => res.send(packageJSON))
  app.get('/favicon.ico', (_, res) => res.status(200).send(null))
  app.get('/generate', generate)
  app.get('/gen', (_, res) => res.sendFile(`${publicPath}/index.html`))
}
