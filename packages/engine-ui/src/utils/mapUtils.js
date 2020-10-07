import palette, { getColor } from './palette'
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers'
import transportDefaultIcon from '../assets/transport.svg'
import transportSelectedIcon from '../assets/transport--selected.svg'
import parcelIcon from '../assets/parcel.svg'
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

export const planToFeature = (plan) => {
  let index = 0
  try {
    return [
      ...plan.flatMap(
        ({ id, activities, current_route: currentRoute, routeIndex }, i) => {
          index = i
          if (activities && activities.length) {
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
                  icon: transportDefaultIcon,
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

export const planActivityIcon = (plan) => {
  if (!plan || !plan.activities) return

  let index = 0
  try {
    return [
      ...plan.activities.slice(1, -1).flatMap(({ id, address }, i) => {
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
      ...transports.flatMap(({ id, tail, start_address, color }, i) => {
        index = i
        return [
          point([start_address.lon, start_address.lat], {
            properties: {
              color,
              highlightColor: color,
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
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 3,
    getFillColor: (d) => helpers.hexToRGBA(d.properties.color),
    highlightColor: [19, 197, 123, 255],
    autoHighlight: true,
    getLineColor: (d) => helpers.hexToRGBA(d.properties.color),
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
    getColor: (d) => helpers.hexToRGBA(d.properties.color),
  })
}

export const toBookingIconLayer = (
  data,
  activeId,
  options = { offset: [0, 0] }
) => {
  if (!data || !data.length) {
    return
  }

  const iconData = data.map((feature) => ({
    coordinates: feature.geometry.coordinates,
    properties: {
      id: feature.id,
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
    id: 'booking-icon',
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
    getColor: (d) => helpers.hexToRGBA(d.properties.color),
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
  planActivityIcon,
}
