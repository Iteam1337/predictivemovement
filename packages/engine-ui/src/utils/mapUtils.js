import palette from '../palette'
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers'
import markerIcon from '../assets/car.svg'

export const point = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates,
  },
  ...props,
})

export const multiPoint = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'MultiPoint',
    coordinates,
  },
  ...props,
})

export const feature = (geometry, props) => ({
  type: 'Feature',
  geometry,
  ...props,
})

export const line = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates,
  },
  ...props,
})

export const hexToRGBA = (hex, opacity) => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return [r, g, b, opacity]
}

export const hexToRGB = (hex) => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return [r, g, b]
}

export const routeAssignedToBooking = (assignedTo) =>
  line(
    assignedTo.route.geometry.coordinates.map(({ lat, lon }) => [lon, lat]),
    {
      id: assignedTo.id,
      properties: {
        color: palette[0][0],
        offset: 0,
      },
    }
  )

export const carToFeature = (cars) => {
  let index = 0
  try {
    return [
      ...cars.flatMap(({ id, tail, position }, i) => {
        index = i
        return [
          point([position.lon, position.lat], {
            properties: {
              color: '#00ff00',
              size: 80,
            },
            id,
            tail,
          }),
        ]
      }),
    ]
  } catch (error) {
    console.log(index, error)
  }
}

export const bookingToFeature = (bookings) =>
  bookings.flatMap(({ id, departure, destination, status, assigned_to }) => {
    switch (status) {
      case 'new':
        return [
          point([departure.lon, departure.lat], {
            id,
            properties: {
              status,
              color: '#ffff00', // yellow
            },
          }),
          point([destination.lon, destination.lat], {
            id,
            properties: {
              color: '#455DF7', // blue
              status,
            },
          }),
          line(
            [
              [destination.lon, destination.lat],
              [departure.lon, departure.lat],
            ],
            {
              id,
              properties: {
                status,
                color: '#dd0000',
              },
            }
          ),
        ]
      default:
        return [
          point([departure.lon, departure.lat], {
            id,
            properties: {
              status,
              color: '#ffff00', // yellow
            },
          }),
          point([destination.lon, destination.lat], {
            id,
            properties: {
              color: '#455DF7', // blue
              status,
            },
          }),
          line(
            [
              [destination.lon, destination.lat],
              [departure.lon, departure.lat],
            ],
            {
              id,
              properties: {
                status,
                color: '#dd0000',
              },
            }
          ),
          routeAssignedToBooking(assigned_to),
        ]
    }
  })

export const toGeoJsonLayer = (id, data) =>
  new GeoJsonLayer({
    id,
    data,
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 2,
    getFillColor: (d) => hexToRGBA(d.properties.color, 255),
    highlightColor: [104, 211, 245, 255],
    autoHighlight: true,
    getLineColor: (d) => hexToRGBA(d.properties.color, 100),
    getRadius: (d) => d.properties.size || 300,
    getLineWidth: 5,
    getElevation: 30,
    pointRadiusScale: 1,
    pointRadiusMaxPixels: 10,
  })

export const toIconLayer = (data, callback) => {
  if (!data.length) {
    return
  }
  const ICON_MAPPING = {
    marker: {
      x: 0,
      y: 0,
      width: 160,
      height: 160,
      mask: true,
    },
  }

  const iconData = data.map((feature) => ({
    coordinates: feature.geometry.coordinates,
    properties: { id: feature.id },
  }))

  return new IconLayer({
    id: 'icon-layer',
    data: iconData,
    pickable: true,
    iconAtlas: markerIcon,
    iconMapping: ICON_MAPPING,
    getIcon: (d) => 'marker',
    sizeScale: 7,
    getPosition: (d) => d.coordinates,
    getSize: (d) => 5,
    getColor: (d) => [Math.sqrt(d.exits), 140, 0],
  })
}

export default {
  feature,
  multiPoint,
  point,
  line,
  bookingToFeature,
  carToFeature,
  toGeoJsonLayer,
  toIconLayer,
  hexToRGB,
}
