require('dotenv').config()

const format = require('date-fns/format')
const setYear = require('date-fns/setYear')
const { exchanges, publish } = require('./adapters/amqp')
const { fetchGeoCodes } = require('./adapters/google')
const { readXlsx, swerefConverter } = require('./helpers')

const id62 = require('id62').default

const jsonPackages = readXlsx(
  `${process.cwd()}/data/${process.env.file}`,
  'Paket 2019 Till Ljusdals kommun'
)

const jsonAddresses = readXlsx(
  `${process.cwd()}/data/${process.env.addresses}`,
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

const bookingDispatcher = async () => {
  if (!process.env.file) {
    console.error('No file specified')
    return
  }

  const packages = jsonPackages
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
    .slice(0, 500)
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

bookingDispatcher()
