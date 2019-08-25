import { Express } from 'express'
import { packageJSON } from '../config'

export default (app: Express) => {
  app.get('/', (_req, res) => res.send(packageJSON))
  app.get('/favicon.ico', (_req, res) => res.status(200).send(null))
}
