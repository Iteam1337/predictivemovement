import conf from '@iteam/config'

const config = conf({
  file: `${__dirname}/../config.json`,
  defaults: {
    count: 10,
    destination: {
      lat: 66.60543,
      lon: 19.82016,
    },
    osrm: 'http://localhost:5000',
    port: 3032,
    radiusInKm: 100,
    routeApi: 'http://localhost:3030',
  },
})

export const count = config.get<number>('count')
export const destination = config.get<{ lat: number; lon: number }>(
  'destination'
)
export const osrm = config.get<string>('osrm')
export const port = config.get<number>('port')
export const radiusInKm = config.get<number>('radiusInKm')
export const routeApi = config.get<string>('routeApi')

export default {
  count,
  destination,
  osrm,
  port,
  radiusInKm,
  routeApi,
}
