import fetch from 'node-fetch'

interface GeocodeResponse {
  results: {
    formatted_address: string
  }[]
}

const toGeocodeQuery = ({ lat, lon }: { lat: string, lon: string}): string =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${lon}&key=${process.env.GOOGLE_API_TOKEN}`

const trimCountrySpec = (address: string) => {
  const [addressName, postalCode, _country] = address
    .split(',')
    .map((str) => str.trim())

  return `${addressName}, ${postalCode}`
}

export const getAddressFromCoordinate = (coordinate: { lat: string, lon: string}): Promise<string | void> =>
  fetch(toGeocodeQuery(coordinate))
    .then((res) => res.json())
    .then(({ results }: GeocodeResponse) => {
      if (!results.length)
        throw new Error('No results found for that coordinate')

      const [first] = results
      return trimCountrySpec(first.formatted_address)
    })
    .catch((err) =>
      console.log('Error getting google geocode data: ', err.message)
    )

export const getDirectionsFromActivities = (activities: { address: { lat: string, lon: string }}[]): string =>
  activities.reduce(
    (result, { address }) => result.concat(`/${address.lat},${address.lon}`),
    'https://www.google.com/maps/dir'
  )

export const getDirectionsUrl = (...args: string[]): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${args.join(',')}`
