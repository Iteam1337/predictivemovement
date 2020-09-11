import moment from 'moment'

const findAddress = async (query) => {
  if (!query) {
    return { features: [] }
  }

  const res = await fetch(
    `https://pelias.iteamdev.io/v1/autocomplete?text=${query}`
  )
  const data = await res.json()
  return data
}

const getAddressFromCoordinate = async ({ lon, lat }) => {
  return await fetch(
    `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
  )
    .then((res) => res.json())
    .then(({ features }) => features[0].properties.label)
}

const calculateMinTime = (date, minDate) => {
  const momentDate = moment(date || minDate)
  const isToday = momentDate.isSame(moment(), 'day')
  if (isToday) {
    const nowAddOneHour = momentDate.add({ hours: 1 }).toDate()
    return nowAddOneHour
  }
  return moment().startOf('day').toDate() // set to 12:00 am today
}

export default { findAddress, calculateMinTime, getAddressFromCoordinate }
