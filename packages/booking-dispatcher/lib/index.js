require('dotenv').config()

const format = require('date-fns/format')
const setYear = require('date-fns/setYear')
const { exchanges, publish, amqp, queues } = require('./adapters/amqp')
const { fetchGeoCodes } = require('./adapters/google')
const { readXlsx, swerefConverter } = require('./helpers')

const id62 = require('id62').default
const codes = [2180, 3875, 4500]

const inArea = (code) => {
  return codes.includes(parseInt(code, 10))
}

const jsonPackages = readXlsx(
  `${process.cwd()}/data/paketdata.xlsx`,
  'Paket 2019 Till Ljusdals kommun'
).filter(
  ({ FromCityCode, ToCityCode }) => inArea(FromCityCode) && inArea(ToCityCode)
)

const jsonAddresses = readXlsx(
  `${process.cwd()}/data/fastigheter.xlsx`,
  'Fastigheter 2019'
).map((row) => {
  const [lat, lon] = swerefConverter(
    row['Y_SWEREF99_Fastighet'],
    row['X_SWEREF99_Fastighet']
  )

  return {
    ...row,
    coordinates: {
      lat,
      lon,
    },
  }
})

const getRandomAddress = (postalNumber) => {
  const addresses = jsonAddresses.filter(
    (a) =>
      a.POSTNR.toString().split(' ').join('') ===
      postalNumber.toString().split(' ').join('')
  )

  return addresses[Math.floor(Math.random() * addresses.length)]
}

const bookingDispatcher = async (total) => {
  jsonPackages
    .map((package) => {
      return {
        ...package,
        packageDeliveryAddress: getRandomAddress(package['Till Postnummer']),
        packagePickupAddress: getRandomAddress(package['Från Postnummer']),
      }
    })
    .filter(
      ({ packageDeliveryAddress, packagePickupAddress }) =>
        packageDeliveryAddress && packagePickupAddress
    )
    .slice(0, total)
    .forEach(
      ({ ShipmentDate, packageDeliveryAddress, packagePickupAddress }) => {
        const booking = {
          delivery: packageDeliveryAddress.coordinates,
          id: id62(),
          senderId: 'the-past',
          bookingDate: ShipmentDate,
          pickup: packagePickupAddress.coordinates,
        }

        publish(exchanges.bookings, exchanges.bookings.routingKeys.NEW, {
          ...booking,
          assigned_to: null,
        })
      }
    )
}

amqp
  .then((conn) => conn.createChannel())
  .then((ch) =>
    ch
      .assertQueue(queues.HISTORICAL_BOOKINGS, {
        durable: false,
      })
      .then(() =>
        ch.consume(queues.HISTORICAL_BOOKINGS, async (message) => {
          const total = parseInt(message.content.toString(), 10)

          try {
            bookingDispatcher(total)
          } catch (error) {
            console.warn('something borked: ', error)
          }
          ch.ack(message)
        })
      )
      .catch(console.warn)
  )
