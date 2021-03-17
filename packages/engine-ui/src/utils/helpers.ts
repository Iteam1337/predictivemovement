import moment from 'moment'
import { MapState } from '../types/state'
interface Feature {
  properties: {
    label: string
    name: string
    county: string
  }
}

const findAddress = (query: string, focusPoint: MapState) => {
  if (!query) {
    return Promise.resolve({ features: [] })
  }

  return fetch(
    `https://pelias.iteamdev.io/v1/autocomplete?layers=address&boundary.country=se&text=${query}&focus.point.lat=${focusPoint.latitude}&focus.point.lon=${focusPoint.longitude}`,
    {
      headers: {
        'Accept-Language': 'sv-SE',
      },
    }
  ).then((res) => res.json())
}

const getAddressFromCoordinate = ({ lon, lat }: { lon: number; lat: number }) =>
  fetch(
    `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
  )
    .then((res) => res.json())
    .then(({ features: [topResult] }: { features: Feature[] }) => {
      if (!topResult) return Promise.reject('Inga resultat hittades...')

      const label = topResult.properties.label.split(',')
      const county = label[label.length - 2].trim()

      return {
        name: topResult.properties.name,
        county: county,
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

const getLastFourChars = (str: string) => str.slice(str.length - 4, str.length)

const withoutLastFourChars = (str: string) => str.slice(0, str.length - 4)

const formatIdForEndUser = (id: string) => getLastFourChars(id).toUpperCase()

const formatCoordinateToFixedDecimalLength = ({
  lat,
  lon,
  length,
}: {
  lat: number
  lon: number
  length: number
}) => `${lat.toFixed(length)}, ${lon.toFixed(length)}`

const hexToRGBA = (hex: string, opacity: number = 255) => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return [r, g, b, opacity]
}

const getDistance = (distance: number) => {
  const dist = Math.round(distance / 1000)

  return `${dist} km`
}

const getDuration = (duration: number) => {
  const num = Math.round(duration / 60)
  const hours = Math.floor(num / 60)
  const minutes = num % 60
  if (hours === 0) {
    return `${minutes}min`
  }
  return `${hours}h ${minutes}min`
}

export {
  findAddress,
  calculateMinTime,
  getAddressFromCoordinate,
  getLastFourChars,
  withoutLastFourChars,
  formatCoordinateToFixedDecimalLength,
  hexToRGBA,
  formatIdForEndUser,
  getDistance,
  getDuration,
}
