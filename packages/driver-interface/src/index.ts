import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bot from './adapters/bot'
import * as botRoutes from './botRoutes'
import { session } from 'telegraf'
import * as consumers from './consumers'


bot.use(session())

consumers.register()

botRoutes.init(bot)

bot.launch()

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
