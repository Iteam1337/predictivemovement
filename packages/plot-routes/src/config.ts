import conf from '@iteam/config'
import { name, version } from '../package.json'

const config = conf({
  file: `${__dirname}/../config.json`,
  defaults: {
    count: 10,
    destination: {
      lat: 66.60543,
      lon: 19.82016,
    },
    express: {
      port: 3032,
      hostname: '',
    },
    osrm: 'http://localhost:5000',
    packageJSON: {
      name,
      version,
    },
    radiusInKm: 100,
    routeApi: 'http://localhost:3030',
  },
})

export const count = config.get<number>('count')
export const destination = config.get<{ lat: number; lon: number }>(
  'destination'
)
export const express = config.get<{ port: number; hostname: string }>('express')
export const osrm = config.get<string>('osrm')
export const packageJSON = config.get<{ name: string; version: string }>(
  'packageJSON'
)
export const port = config.get<number>('port')
export const radiusInKm = config.get<number>('radiusInKm')
export const routeApi = config.get<string>('routeApi')

export default {
  count,
  destination,
  express,
  osrm,
  packageJSON,
  port,
  radiusInKm,
  routeApi,
}
