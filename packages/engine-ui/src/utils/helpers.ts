import moment from 'moment'

interface Feature {
  properties: {
    label: string
  }
}

const findAddress = (query: string) => {
  if (!query) {
    return { features: [] }
  }

  return fetch(
    `https://pelias.iteamdev.io/v1/autocomplete?layers=address&boundary.country=se&text=${query}`
  ).then((res) => res.json())
}

const getAddressFromCoordinate = ({ lon, lat }: { lon: string; lat: string }) =>
  fetch(
    `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
  )
    .then((res) => res.json())
    .then(
      ({ features }: { features: Feature[] }) => features[0].properties.label
    )

const calculateMinTime = (date?: Date, minDate?: Date) => {
  const momentDate = moment(date || minDate)
  const isToday = momentDate.isSame(moment(), 'day')
  if (isToday) {
    const nowAddOneHour = momentDate.add({ hours: 1 }).toDate()
    return nowAddOneHour
  }
  return moment().startOf('day').toDate() // set to 12:00 am today
}

const formatIdAsFourChar = (id: string) => id.slice(id.length - 4, id.length)

export default {
  findAddress,
  calculateMinTime,
  getAddressFromCoordinate,
  formatIdAsFourChar,
}
