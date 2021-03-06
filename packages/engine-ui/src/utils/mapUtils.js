import palette, { getColor } from './palette'
import { GeoJsonLayer, IconLayer, TextLayer } from '@deck.gl/layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import parcelIcon from '../assets/parcel.svg'
import * as helpers from './helpers'
import excludedParcelIcon from '../assets/excluded-parcel.svg'
import IconClusterLayer from './IconClusterLayer'
import iconMapping from '../assets/location-icon-mapping.json'
import iconMappingTransports from '../assets/icon-mapping-transports.json'
import iconAtlasBookings from '../assets/icon-atlas-bookings.png'
import iconAtlasTransports from '../assets/icon-atlas-transports.png'

const point = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates,
  },
  ...props,
})

const feature = (geometry, props) => ({
  type: 'Feature',
  geometry,
  ...props,
})

const line = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'MultiLineString',
    coordinates: [coordinates],
  },
  ...props,
})

const text = (coordinates, props) => ({
  type: 'Feature',
  geometry: {
    type: 'Text',
    coordinates,
  },
  ...props,
})

const routeAssignedToBooking = (assignedTo) =>
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

const routeActivitiesToFeature = (plan) => {
  if (!plan) return []

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

const toTextLayer = (data) => {
  if (!data) return new TextLayer()
  return new TextLayer({
    id: 'text-layer',
    data,
    fontFamily: 'Roboto Mono',
    getText: (d) => d.routeIndex,
    getPosition: (d) => d.geometry.coordinates,
    getSize: 20,
  })
}

const planToFeature = (plan, transports) => {
  let index = 0
  try {
    return [
      ...plan.flatMap(({ id, activities, currentRoute, routeIndex }, i) => {
        index = i
        if (currentRoute && activities?.length) {
          const route = line(
            currentRoute.geometry.coordinates.map(({ lat, lon }) => [lon, lat]),
            {
              id,
              properties: {
                color:
                  transports.find((t) => t.id === id)?.color ||
                  getColor(routeIndex || 0, 3),
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
                  color:
                    transports.find((t) => t.id === id)?.color ||
                    getColor(routeIndex || 0, 4),
                  offset: 0,
                  type: 'plan',
                },
              })
            )

          return [...points, route]
        }
        return []
      }),
    ]
  } catch (error) {
    console.log(index, error)
  }
}

const bookingToFeature = (bookings) => {
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
              color: '#ccffcc',
              offset: 0,
              address: { pickup, delivery },
              type: 'booking',
            },
          }
        ),
      ]
    }
    return route ? points : []
  })
}

const toGeoJsonLayer = (id, data, callback) =>
  new GeoJsonLayer({
    id,
    data,
    pickable: true,
    autoHighlight: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    lineWidthMinPixels: 1.5,
    getFillColor: ({ properties }) =>
      helpers.hexToRGBA(properties.color, properties.opacity),
    getLineColor: (d) => helpers.hexToRGBA(d.properties.color, 190),
    highlightColor: ({ object: { properties } }) =>
      helpers.hexToRGBA(properties.color, properties.opacity),
    getRadius: (d) => d.properties.size || 300,
    getLineWidth: 10,
    getElevation: 30,
    pointRadiusScale: 1,
    pointRadiusMaxPixels: 10,
    lineJointRounded: true,
    onClick: callback,
    getOffset: 1.4,
    extensions: [new PathStyleExtension({ offset: true })],
  })

const toExcludedBookingIcon = (booking, activeId) => {
  if (!booking) {
    return new IconLayer()
  }

  const iconData = [
    {
      coordinates: [booking.lon, booking.lat],
      properties: {
        id: booking.id,
        size: 8,
        activeSize: 10,
      },
    },
  ]

  return new IconLayer({
    id: `excluded-booking-icon-${booking.id}`,
    data: iconData,
    pickable: true,
    getIcon: () => ({
      url: excludedParcelIcon,
      mask: false,
      width: 128,
      height: 128,
    }),
    sizeScale: 5,
    getPosition: (d) => d.coordinates,
    transitions: { getSize: { duration: 100 }, getColor: { duration: 100 } },
    getSize: (d) =>
      d.properties.id === activeId
        ? d.properties.activeSize
        : d.properties.size,
  })
}

const toBookingIconLayer = (
  data,
  coordinatesProp,
  activeId,
  options = { offset: [0, 0] },
  index
) => {
  const iconData = data.flatMap((d) => ({
    coordinates: [d[coordinatesProp].lon, d[coordinatesProp].lat],
    properties: {
      id: d.id,
      color: activeId === d.id ? '#19DE8B' : '#ffffff',
      size: 5,
      activeSize: 7,
      icon: parcelIcon,
      type: 'booking',
    },
  }))

  return new IconLayer({
    id: `booking-icon-${index}`,
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

const toIconClusterLayer = ({ data, type, properties }) => {
  const layerProps = {
    data,
    pickable: true,
    getPosition: (d) => d.coordinates,
    getColor: (d) =>
      helpers.hexToRGBA(
        d.properties.active ? '#19DE8B' : '#ffffff',
        d.properties.opacity
      ),

    iconAtlas: iconAtlasBookings,
    iconMapping,
    ...properties,
  }

  return new IconClusterLayer({
    ...layerProps,
    id: `icon-cluster-${type}`,
    sizeScale: 45,
  })
}

const toTransportIconLayer = (transports, activeId) => {
  return toIconClusterLayer({
    type: 'transports',
    data: transports.flatMap(({ id, startAddress, location, color }) => ({
      coordinates: [
        location?.lon || startAddress.lon,
        location?.lat || startAddress.lat,
      ],
      active: id === activeId,
      color,
    })),
    properties: {
      iconAtlas: iconAtlasTransports,
      iconMapping: iconMappingTransports,
      getColor: (d) => {
        if (d.properties.cluster) {
          return helpers.hexToRGBA(
            d.properties.active ? '#19DE8B' : '#ffffff',
            d.properties.opacity
          )
        }
        return helpers.hexToRGBA(d.properties.color, d.properties.opacity)
      },
    },
  })
}

export {
  feature,
  point,
  line,
  bookingToFeature,
  planToFeature,
  toGeoJsonLayer,
  toBookingIconLayer,
  toTransportIconLayer,
  toIconClusterLayer,
  toTextLayer,
  routeActivitiesToFeature,
  toExcludedBookingIcon,
}
