require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./adapters/bot')
const botRoutes = require('./botRoutes')
const session = require('telegraf/session')
const consumers = require('./consumers')

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

const server = require('http').Server(app)
const port = process.env.PORT || 5000
server.listen(port, console.log(`listening on ${port}`))

// Pickup instructions example message
// { "id": "1124095220",
//   "booking":{
//      "departure": {"latitude": "57.00234", "longitude": "16.0134143" }}}

// Delivery RPC example message
// {
//   "car": {
//     "route": {
//       "weight_name": "routability",
//       "weight": 1561,
//       "started": "2020-04-07T13:09:42.334878",
//       "legs": [
//         null
//       ],
//       "geometry": [
//         null
//       ],
//       "duration": 1561,
//       "distance": 18171
//     },
//     "position": {
//       "lon": 11.801236,
//       "lat": 57.736512
//     },
//     "instructions": [
//       [
//         null
//       ],
//       [
//         null
//       ]
//     ],
//     "id": 1124095220,
//     "heading": {
//       "position": [
//         null
//       ],
//       "booking": [
//         null
//       ],
//       "action": "pickup"
//     },
//     "busy": false
//   },
//   "booking": {
//     "id": 493,
//     "destination": {
//       "lon": 16.143512,
//       "lat": 61.905908
//     },
//     "departure": {
//       "lon": 15.981676,
//       "lat": 61.847311
//     },
//     "bookingDate": "2020-04-07T13:09:15.732840Z"
//   }
// }
