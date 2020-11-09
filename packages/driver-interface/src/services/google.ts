import fetch from 'node-fetch'
import { Instruction } from '../types'

interface GeocodeResponse {
  results: {
    formatted_address: string
  }[]
}

const toGeocodeQuery = ({ lat, lon }: { lat: string; lon: string }): string =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${lon}&key=${process.env.GOOGLE_API_TOKEN}`

const trimCountrySpec = (address: string): string => {
  const [addressName, postalCode, _country] = address
    .split(',')
    .map((str) => str.trim())

  return `${addressName}, ${postalCode}`
}

export const getAddressFromCoordinate = (coordinate: {
  lat: string
  lon: string
}): Promise<string | void> =>
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

export const getDirectionsFromInstructions = (
  instructionGroups: Instruction[][]
): string =>
  instructionGroups
    .flatMap((instructionGroup: Instruction[]) =>
      instructionGroup.map(({ address }) => address)
    )
    .filter(
      (address, index, array) =>
        array.findIndex(({ name }) => address.name === name) == index
    )
    .reduce(
      (result, { lat, lon }) => `${result}/${lat},${lon}`,
      'https://www.google.com/maps/dir'
    )

export const getDirectionsUrl = (...args: string[]): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${args.join(',')}`
