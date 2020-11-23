import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import * as mapUtils from '../utils/mapUtils'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Tooltip from './Tooltip'

import * as stores from '../utils/state/stores'

const Map = ({ data }) => {
  const history = useHistory()
  const [viewState, setViewState] = stores.map((state) => [state, state.set])
  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])

  const showTextLayer = useRouteMatch({
    path: ['/plans/routes/:routeId'],
  })

  const handleClickEvent = (event) => {
    if (!event.object?.properties) return
    const type = event.object.properties.type
    const id = event.object.id || event.object.properties.id
    switch (type) {
      case 'booking':
        return history.push(`/bookings/${id}`)
      case 'transport':
      case 'plan':
        return history.push(`/transports/${id}`)
      default:
        return
    }
  }

  const onMapClick = ({ lngLat: [lon, lat], x, y }) =>
    setUIState({
      type: 'lastClickedPosition',
      payload: { lat, lon, x, y },
    })

  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(data.bookings),
      handleClickEvent
    ),
    mapUtils.toGeoJsonLayer(
      'geojson-plan-layer',
      mapUtils.planToFeature(data.plan.routes),
      handleClickEvent
    ),
    mapUtils.toGeoJsonLayer(
      'geojson-transport-layer',
      mapUtils.planToFeature(data.transports),
      handleClickEvent
    ),
    data.plan.routes
      .map((route) =>
        mapUtils.toBookingIconLayer(
          route.activities?.slice(1, -1),
          'address',
          UIState.highlightBooking,
          { offset: [40, 0] }
        )
      )
      .concat(
        data.plan.excludedBookings.map((b) =>
          mapUtils.toExcludedBookingIcon(b, UIState.highlightBooking)
        )
      ),
    showTextLayer &&
      mapUtils.toTextLayer(mapUtils.routeActivitiesToFeature(data.plan.routes)),
    mapUtils.toTransportIconLayer(data.transports, UIState.highlightTransport),
    mapUtils.toIconClusterLayer(
      data.bookings.flatMap(({ id, pickup }) => ({
        coordinates: [pickup.lon, pickup.lat],
        active: id === UIState.highlightBooking,
      }))
    ),
    // mapUtils.toBookingIconLayer(
    //   data.bookings,
    //   'pickup',
    //   UIState.highlightBooking
    // ),
  ]

  const handleDragEvent = () =>
    UIState.showMapTooltip && setUIState({ type: 'hideTooltip' })

  return (
    <>
      <DeckGL
        layers={layers}
        controller={true}
        onClick={(e) => {
          onMapClick(e)
          handleClickEvent(e)
        }}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        onDrag={handleDragEvent}
      >
        <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
      </DeckGL>
      {UIState.showMapTooltip && (
        <Tooltip position={UIState.lastClickedPosition} />
      )}
    </>
  )
}

export default Map
