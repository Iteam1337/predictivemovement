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

// from telegram booking
// {
//   id: 'ccddf1aa-e104-4b6a-92ab-c75fd184f6d3',
//   senderId: 987557478,
//   bookingDate: '2020-06-02T09:25:36.348Z',
//   departure: { lon: 12.123993, lat: 58.120939 },
//   destination: { lon: 12.016714, lat: 57.719823 }
const wait = (time) =>
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

  // const changedData = {departure: {lon: 57.7213783, lat: 12.0173562}, destination: {lon: 57.7213783, lat: 12.1173562}, id: id62(), bookingDate: withGeoCodes.ShipmentDate, ...withGeoCodes}
  //   // withGeoCodes['Till Postnummer'] = {departure: {lon: 57.7213783, lat: 12.0173562}}

  // const withGeoCodes = packages.map(async (p) => {
  //   const to = await fetch(
  //     `https://nominatim.openstreetmap.org/search?country=sweden&postalcode=${p['Till Postnummer']}&format=json`,
  //   ).then((res) => res.json())

  //   const from = await fetch(
  //     `https://nominatim.openstreetmap.org/search?country=sweden&postalcode=${p['Från Postnummer']}&format=json`,
  //   ).then((res) => res.json())
  // })

  const fetchGeoCodes = async (postalcode) => {
    const geoCode = await fetch(
      `https://nominatim.openstreetmap.org/search?country=sweden&postalcode=${postalcode}&format=json`
    )
      .then((res) => res.json())
      .catch((error) => console.log(error))
    return geoCode
  }

  for (let package of packages) {
    // console.log('to', package['Till Postnummer'])
    const to = await fetchGeoCodes(package['Till Postnummer'])
    bookingTo = {
      departure: { lon: parseFloat(to[0].lon), lat: parseFloat(to[0].lat) },
    }
    await wait(5000)

    const from = await fetchGeoCodes(package['Från Postnummer'])

    await wait(5000)
    package = {
      destination: {
        lon: parseFloat(from[0].lon),
        lat: parseFloat(from[0].lat),
      },
      id: id62(),
      senderId: 'the-past',
      bookingDate: package.ShipmentDate,
      ...bookingTo,
    }

    createBooking(package)
  }
}

const createBooking = (booking) => {
  console.log(booking)
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
