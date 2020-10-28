import palette, { getColor } from './palette'
import { GeoJsonLayer, IconLayer, TextLayer } from '@deck.gl/layers'
import transportDefaultIcon from '../assets/transport.svg'
import transportSelectedIcon from '../assets/transport--selected.svg'
import parcelIcon from '../assets/parcel.svg'
import excludedParcelIcon from '../assets/excluded-parcel.svg'
import helpers from './helpers'

export const point = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
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
    type: 'MultiLineString',
    coordinates: [coordinates],
  },
  ...props,
})

export const text = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'Text',
    coordinates,
  },
  ...props,
})

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

export const routeActivitiesToFeature = (plan) => {
  return [
    ...plan.flatMap(({ activities, id }) => {
      const routeActivities = activities
        .filter(({ type }) => type !== 'start')
        .map(({ address }, index) =>
          text([address.lon, address.lat], {
            id,
            routeIndex: String(index + 1),
          })
        )
      return [...routeActivities]
    }),
  ]
}

export const toTextLayer = (data) =>
  new TextLayer({
    id: 'text-layer',
    data,
    fontFamily: 'Roboto Mono',
    getText: (d) => d.routeIndex,
    getPosition: (d) => d.geometry.coordinates,
    getSize: 20,
  })

export const planToFeature = (plan) => {
  let index = 0
  try {
    return [
      ...plan.flatMap(
        ({ id, activities, current_route: currentRoute, routeIndex }, i) => {
          index = i
          if (currentRoute && activities && activities.length) {
            const route = line(
              currentRoute.geometry.coordinates.map(({ lat, lon }) => [
                lon,
                lat,
              ]),
              {
                id,
                properties: {
                  color: getColor(routeIndex || 0, 3),
                  offset: 0,
                  type: 'plan',
                },
              }
            )

            const points = activities
              .filter(({ type }) => type !== 'start')
              .map(({ address }) =>
                point([address.lon, address.lat], {
                  id,
                  properties: {
                    color: getColor(routeIndex || 0, 4),
                  },
                })
              )

            return [...points, route]
          }
          return []
        }
      ),
    ]
  } catch (error) {
    console.log(index, error)
  }
}

export const excludedBookingIcon = (booking) => {
  if (!booking) return

  return [
    point([booking.lon, booking.lat], {
      properties: {
        size: 80,
      },
      id: booking.id,
    }),
  ]
}

export const routeActivityIcon = (route) => {
  if (!route || !route.activities) return

  let index = 0
  try {
    return [
      ...route.activities.slice(1, -1).flatMap(({ id, address }, i) => {
        index = i
        return [
          point([address.lon, address.lat], {
            properties: {
              color: '#ffffff',
              highlightColor: '#19DE8B',
              size: 80,
            },
            id,
          }),
        ]
      }),
    ]
  } catch (error) {
    console.log(index, error)
  }
}

export const transportIcon = (transports) => {
  let index = 0
  try {
    return [
      ...transports.flatMap(
        ({ id, tail, start_address, location, color }, i) => {
          index = i
          return [
            point(
              [
                location?.lon || start_address.lon,
                location?.lat || start_address.lat,
              ],
              {
                properties: {
                  color,
                  highlightColor: color,
                  size: 80,
                },
                id,
                tail,
              }
            ),
          ]
        }
      ),
    ]
  } catch (error) {
    console.log(index, error)
  }
}

export const bookingIcon = (bookings) => {
  let index = 0
  try {
    return [
      ...bookings.flatMap(({ id, pickup }, i) => {
        index = i
        return [
          point([pickup.lon, pickup.lat], {
            properties: {
              color: '#ffffff',
              highlightColor: '#19DE8B',
              size: 80,
            },
            id,
          }),
        ]
      }),
    ]
  } catch (error) {
    console.log(index, error)
  }
}

export const bookingToFeature = (bookings) => {
  return bookings.flatMap(({ id, pickup, delivery, status, route }) => {
    const points = [
      point([delivery.lon, delivery.lat], {
        id,
        properties: {
          status,
          color: '#ccffcc',
        },
      }),
    ]

    if (status === 'assigned' && route) {
      return [...points, routeAssignedToBooking({ id, route })]
    }

    if (route) {
      return [
        ...points,
        line(
          route.geometry.coordinates.map(({ lat, lon }) => [lon, lat]),
          {
            id,
            properties: {
              color: '#e6ffe6',
              offset: 0,
              address: { pickup: pickup, delivery: delivery },
              type: 'booking',
            },
          }
        ),
      ]
    }
    return route ? points : []
  })
}

export const toGeoJsonLayer = (id, data, callback) =>
  new GeoJsonLayer({
    id,
    data,
    pickable: true,
    autoHighlight: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 3,
    getFillColor: ({ properties }) =>
      helpers.hexToRGBA(properties.color, properties.opacity),
    getLineColor: (d) => helpers.hexToRGBA(d.properties.color, 150),
    highlightColor: ({ object: { properties } }) =>
      helpers.hexToRGBA(properties.color, properties.opacity),
    getRadius: (d) => d.properties.size || 300,
    getLineWidth: 5,
    getElevation: 30,
    pointRadiusScale: 1,
    pointRadiusMaxPixels: 10,
    lineJointRounded: true,
    onClick: callback,
  })

export const toTransportIconLayer = (data, activeId) => {
  if (!data.length) {
    return
  }

  const iconData = data.map((feature) => ({
    coordinates: feature.geometry.coordinates,
    properties: {
      id: feature.id,
      opacity: activeId === feature.id ? null : feature.properties.opacity,
      color:
        activeId === feature.id
          ? feature.properties.highlightColor
          : feature.properties.color,
      icon: transportDefaultIcon,
      highlightIcon: transportSelectedIcon,
      size: 7,
      highlightSize: 9,
    },
  }))

  return new IconLayer({
    id: 'transport-icon',
    data: iconData,
    pickable: true,
    getIcon: (d) => {
      return {
        url:
          d.properties.id === activeId
            ? d.properties.highlightIcon
            : d.properties.icon,
        mask: true,
        width: 128,
        height: 128,
      }
    },
    sizeScale: 5,
    getPosition: (d) => d.coordinates,
    transitions: { getSize: { duration: 100 }, getColor: { duration: 100 } },
    getSize: (d) =>
      d.properties.id === activeId
        ? d.properties.highlightSize
        : d.properties.size,
    getColor: (d) =>
      helpers.hexToRGBA(d.properties.color, d.properties.opacity),
  })
}

const toExcludedBookingIcon = (booking, activeId) => {
  if (!booking) {
    return
  }
  const iconData = excludedBookingIcon(booking).map((feature) => ({
    coordinates: feature.geometry.coordinates,
    properties: {
      id: feature.id,
      size: 8,
      activeSize: 10,
    },
  }))

  return new IconLayer({
    id: `excluded-booking-icon-${booking.id}`,
    data: iconData,
    pickable: true,
    getIcon: (d) => {
      return {
        url: excludedParcelIcon,
        mask: false,
        width: 128,
        height: 128,
      }
    },
    sizeScale: 5,
    getPosition: (d) => d.coordinates,
    transitions: { getSize: { duration: 100 }, getColor: { duration: 100 } },
    getSize: (d) =>
      d.properties.id === activeId
        ? d.properties.activeSize
        : d.properties.size,
  })
}

export const toBookingIconLayer = (
  data,
  activeId,
  options = { offset: [0, 0] },
  layerId = 'booking-icon'
) => {
  if (!data || !data.length) {
    return
  }

  const iconData = data.map((feature) => ({
    coordinates: feature.geometry.coordinates,
    properties: {
      id: feature.id,
      opacity: activeId === feature.id ? null : feature.properties.opacity,
      color:
        activeId === feature.id
          ? feature.properties.highlightColor
          : feature.properties.color,
      size: 5,
      activeSize: 7,
      icon: parcelIcon,
    },
  }))

  return new IconLayer({
    id: layerId,
    data: iconData,
    pickable: true,
    getPixelOffset: options.offset,
    getIcon: (d) => {
      return {
        url: d.properties.icon,
        mask: true,
        width: 128,
        height: 128,
      }
    },
    sizeScale: 5,
    getPosition: (d) => d.coordinates,
    transitions: { getSize: { duration: 100 }, getColor: { duration: 100 } },
    getSize: (d) =>
      d.properties.id === activeId
        ? d.properties.activeSize
        : d.properties.size,
    getColor: (d) =>
      helpers.hexToRGBA(d.properties.color, d.properties.opacity),
  })
}

export default {
  feature,
  point,
  line,
  bookingToFeature,
  planToFeature,
  toGeoJsonLayer,
  toBookingIconLayer,
  transportIcon,
  toTransportIconLayer,
  bookingIcon,
  routeActivityIcon,
  toTextLayer,
  routeActivitiesToFeature,
  toExcludedBookingIcon,
}
