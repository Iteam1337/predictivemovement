import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bot from './adapters/bot'
import * as botRoutes from './botRoutes'
import { session } from 'telegraf'
import * as consumers from './consumers'
import { TelegrafContext } from 'telegraf/typings/context'
import { sendUnhandledError } from './services/messaging'

bot.use(session())

consumers.register()

botRoutes.init(bot)

bot.launch()

bot.catch((e, { update: { callback_query, message } }: TelegrafContext) => {
  let telegramId: number
  let request: string
  if (callback_query) {
    telegramId = callback_query.from.id
    request = `callback with data '${callback_query.data}'`
  } else {
    telegramId = message.from?.id
    request = `message: '${message.text}'`
  }
  console.error(
    `Failed when handling ${request} from telegram id: ${telegramId}. Exception: ${e}`
  )

  return sendUnhandledError(telegramId)
})

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
