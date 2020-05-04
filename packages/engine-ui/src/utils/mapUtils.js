import palette from '../palette'
import { GeoJsonLayer, IconLayer, PathLayer } from '@deck.gl/layers'
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

export const carToFeature = (newCars, carCollection, carLineCollection) => {
  const carFeatures = [
    ...carCollection.features.filter(
      (car) => !newCars.some((nc) => nc.id === car.id)
    ),
    ...newCars.flatMap(({ id, tail, position, heading, detour }, i) => [
      multiPoint(
        [
          [position.lon, position.lat],
          [heading.lon, heading.lat],
        ],
        {
          properties: {
            color: palette[i][0],
            diff: diff(heading, detour),
          },
          id,
          tail,
        }
      ),
    ]),
  ]

  const carLineFeatures = [
    ...carLineCollection.features.filter(
      (carLine) => !newCars.some((nc) => nc.id === carLine.id)
    ),

    ...newCars.flatMap(({ id, detour }, i) =>
      feature(detour.geometry, {
        id,
        properties: {
          color: palette[i][0],
          offset: i * 2,
        },
      })
    ),
  ]

  return { carFeatures, carLineFeatures }
}

export const movingCarToFeature = (newCars, movingCarsCollection) => {
  let index = 0
  try {
    return [
      ...movingCarsCollection.features.filter(
        (car) => !newCars.some((nc) => nc.id === car.id)
      ),
      ...newCars.flatMap(({ id, tail, position, heading }, i) => {
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

export const bookingToFeature = (newBookings) =>
  newBookings.flatMap(({ id, departure, destination }) => [
    multiPoint(
      [
        [departure.lon, departure.lat],
        // [destination.lon, destination.lat],
      ],
      {
        id,
        properties: {
          color: '#ffff00', // yellow
        },
      }
    ),
    multiPoint(
      [
        // [departure.lon, departure.lat],
        [destination.lon, destination.lat],
      ],
      {
        id,
        properties: {
          color: '#455DF7', // blue
        },
      }
    ),
    line(
      [
        [destination.lon, destination.lat],
        [departure.lon, departure.lat],
      ],
      {
        id,
        properties: {
          color: '#dd0000',
        },
      }
    ),
  ])

export const diff = (
  { route: { distance: headingDistance, duration: headingDuration } },
  { distance: detourDistance, duration: detourDuration }
) => ({
  duration: detourDuration - headingDuration,
  distance: detourDistance - headingDistance,
})

export const toGeoJsonLayer = (id, data, callback) =>
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
    onHover: ({ object }) => object && callback(object),
  })

export const toIconLayer = (data) => {
  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 160, height: 160, mask: true },
  }
  const iconData = data.features.map((feature) => ({
    coordinates: feature.geometry.coordinates,
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
    onHover: ({ object, x, y }) => {},
  })
}

export default {
  feature,
  multiPoint,
  point,
  line,
  bookingToFeature,
  movingCarToFeature,
  carToFeature,
  toGeoJsonLayer,
  toIconLayer,
  hexToRGB,
}
