import moment from 'moment'

interface Feature {
  properties: {
    label: string
    name: string
    county: string
  }
}

const findAddress = (query: string) => {
  if (!query) {
    return Promise.resolve({ features: [] })
  }
  return fetch(
    `https://pelias.iteamdev.io/v1/autocomplete?layers=address&boundary.country=se&text=${query}`
  ).then((res) => res.json())
}

const getAddressFromCoordinate = ({ lon, lat }: { lon: number; lat: number }) =>
  fetch(
    `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
  )
    .then((res) => res.json())
    .then(({ features: [topResult] }: { features: Feature[] }) => {
      if (!topResult) return Promise.reject('Inga resultat hittades...')
      return {
        name: topResult.properties.name,
        county: topResult.properties.county,
      }
    })

const calculateMinTime = (date?: Date, minDate?: Date) => {
  const momentDate = moment(date || minDate)
  const isToday = momentDate.isSame(moment(), 'day')
  if (isToday) {
    const nowAddOneHour = momentDate.add({ hours: 1 }).toDate()
    return nowAddOneHour
  }
  return moment().startOf('day').toDate() // set to 12:00 am today
}

const formatCoordinateToFixedDecimalLength = ({
  lat,
  lon,
}: {
  lat: number
  lon: number
}) => `${lat.toFixed(6)}, ${lon.toFixed(6)}`

export default {
  findAddress,
  calculateMinTime,
  getAddressFromCoordinate,
  formatCoordinateToFixedDecimalLength,
}
