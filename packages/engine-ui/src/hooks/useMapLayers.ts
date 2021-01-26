import React from 'react'
import * as mapUtils from '../utils/mapUtils'
import * as types from '../types'

const useMapLayers = (
  state: types.state.DataState,
  mapState: types.state.MapLayerState,
  UIState: types.state.UIState,
  handleClick: (event: any) => void,
  showTextLayer: boolean
) =>
  React.useMemo(
    () => [
      mapUtils.toGeoJsonLayer(
        'geojson-bookings-layer',
        mapUtils.bookingToFeature(mapState.bookings),
        handleClick
      ),
      mapUtils.toGeoJsonLayer(
        'geojson-plan-layer',
        mapUtils.planToFeature(mapState.plan.routes, state.transports),
        handleClick
      ),
      mapUtils.toGeoJsonLayer(
        'geojson-transport-layer',
        mapUtils.planToFeature(mapState.transports),
        handleClick
      ),
      ...mapState.plan.routes
        .map((route, i) =>
          mapUtils.toBookingIconLayer(
            route.activities?.slice(1, -1),
            'address',
            UIState.highlightBooking,
            { offset: [40, 0] },
            i
          )
        )
        .concat(
          mapState.plan.excludedBookings.map((b) =>
            mapUtils.toExcludedBookingIcon(b, UIState.highlightBooking)
          )
        ),
      mapUtils.toTransportIconLayer(
        mapState.transports,
        UIState.highlightTransport
      ),
      mapUtils.toIconClusterLayer({
        type: 'bookings',
        data: mapState.bookings.flatMap(({ id, pickup }) => ({
          coordinates: [pickup.lon, pickup.lat],
          active: id === UIState.highlightBooking,
        })),
        properties: {},
      }),
      mapUtils.toTextLayer(
        mapUtils.routeActivitiesToFeature(showTextLayer && mapState.plan.routes)
      ),
    ],
    [
      UIState.highlightBooking,
      UIState.highlightTransport,
      handleClick,
      mapState.bookings,
      mapState.plan.excludedBookings,
      mapState.plan.routes,
      mapState.transports,
      showTextLayer,
      state.transports,
    ]
  )

export default useMapLayers
