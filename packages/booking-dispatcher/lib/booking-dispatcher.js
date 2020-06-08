require('dotenv').config()

const fs = require('fs')
const XLSX = require('xlsx')
const format = require('date-fns/format')
const setYear = require('date-fns/setYear')
const fetch = require('node-fetch')
const amqp = require('amqplib').connect(
  process.env.AMQP_HOST || 'amqp://localhost'
)
const id62 = require('id62').default

const waitForRequestLimit = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time))

const bookingDispatcher = async () => {
  if (!process.env.file) {
    console.error('No file specified')
    return
  }

  const buf = fs.readFileSync(`${process.cwd()}/data/${process.env.file}`)
  const wb = XLSX.read(buf, { type: 'buffer' })

  const debugDate = new Date('2020-09-13')

  const packages = XLSX.utils
    .sheet_to_json(wb.Sheets['Paket 2019 Till Ljusdals kommun'])
    .filter(
      (x) =>
        format(setYear(new Date(x.ShipmentDate), 2020), 'yyyy-MM-dd') ===
        format(debugDate, 'yyyy-MM-dd')
    )

  const fetchGeoCodes = (postalcode) => {
    const geoCode = fetch(
      `https://nominatim.openstreetmap.org/search?country=sweden&postalcode=${postalcode}&format=json`
    ).then((res) => res.json())
    return geoCode
  }

  for (let package of packages) {
    try {
      const to = await fetchGeoCodes(package['Till Postnummer'])
      const bookingTo = {
        pickup: { lon: parseFloat(to[0].lon), lat: parseFloat(to[0].lat) },
      }
      await waitForRequestLimit(1500)

      const from = await fetchGeoCodes(package['Från Postnummer'])

      await waitForRequestLimit(1500)
      package = {
        delivery: {
          lon: parseFloat(from[0].lon),
          lat: parseFloat(from[0].lat),
        },
        id: id62(),
        senderId: 'the-past',
        bookingDate: package.ShipmentDate,
        ...bookingTo,
      }
    } catch (error) {
      throw new Error(error)
    }

    createBooking(package)
  }
}

const createBooking = (booking) => {
  return amqp
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertExchange('bookings', 'topic', {
          durable: false,
        })
        .then(() =>
          ch.publish(
            'bookings',
            'new',
            Buffer.from(JSON.stringify({ ...booking, assigned_to: null }))
          )
        )
    )
    .catch(console.warn)
}

bookingDispatcher()
