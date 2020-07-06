const readXlsx = require('./packages/booking-dispatcher/lib/helpers/readXlsx')
const grid_to_geodetic = require('./packages/booking-dispatcher/lib/helpers/swerefConverter')

const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csvWriter = createCsvWriter({
  path: 'paketdata2019.csv',
  header: [
    { id: 'id', title: 'id' },
    { id: 'source', title: 'source' },
    { id: 'layer', title: 'layer' },
    { id: 'name', title: 'name' },
    { id: 'housenumber', title: 'housenumber' },
    { id: 'street', title: 'street' },
    { id: 'postcode', title: 'postcode' },
    { id: 'lat', title: 'lat' },
    { id: 'lon', title: 'lon' },
  ],
})

const jsonPackages = readXlsx(
  `${process.cwd()}/fastigheter2019.xlsx`,
  'Fastigheter 2019'
)
  .map((row) => {
    const [lat, lon] = grid_to_geodetic(
      row['Y_SWEREF99_Fastighet'],
      row['X_SWEREF99_Fastighet']
    )

    return {
      lat,
      lon,
      ...row,
    }
  })
  .map((row) => ({
    id: row['ID'],
    source: 'fastighetsregister-2019',
    layer: 'address',
    name: row['UTDELNINGSADRESS'],
    housenumber: getHouseNr(row['UTDELNINGSADRESS']),
    street: getStreet(row['UTDELNINGSADRESS']),
    postcode: row['POSTNR'],
    lat: row['lat'],
    lon: row['lon'],
  }))
function getHouseNr(address) {
  const re = /\d+-*\s?.?/g
  const nrMatch = address.match(re)
  if (nrMatch) {
    return nrMatch.join('')
  }
  return null
}

function getStreet(address) {
  const re = /\d+-*\s?.?/g
  return address.replace(re, '').trim()
}

csvWriter
  .writeRecords(jsonPackages)
  .then(() => console.log('The CSV file was written successfully'))
