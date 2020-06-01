require('dotenv').config()

const fs = require('fs')
const XLSX = require('xlsx')
const format = require('date-fns/format')
const setYear = require('date-fns/setYear')
const fetch = require('node-fetch')

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
        format(debugDate, 'yyyy-MM-dd'),
    )

  const withGeoCodes = packages.map(async (p) => {
    const to = await fetch(
      `https://nominatim.openstreetmap.org/search?country=sweden&postalcode=${p['Till Postnummer']}&format=json`,
    ).then((res) => res.json())

    const from = await fetch(
      `https://nominatim.openstreetmap.org/search?country=sweden&postalcode=${p['Från Postnummer']}&format=json`,
    ).then((res) => res.json())
  })
}
bookingDispatcher()
