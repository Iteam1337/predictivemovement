import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import * as mapUtils from '../utils/mapUtils'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Tooltip from './Tooltip'

import * as stores from '../utils/state/stores'

const Map = ({ data }) => {
  const [isHovering, setHover] = React.useState(false)
  const history = useHistory()
  const [viewState, setViewState] = stores.map((state) => [state, state.set])
  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])

  const showTextLayer = useRouteMatch({
    path: ['/plans/routes/:routeId'],
  })

  const hideTooltip = () =>
    UIState.showMapTooltip && setUIState({ type: 'hideTooltip' })

  const handleClickEvent = (event) => {
    if (!event.object) {
      const {
        lngLat: [lon, lat],
        x,
        y,
      } = event
      return setUIState({
        type: 'lastClickedPosition',
        payload: { lat, lon, x, y },
      })
    }

    hideTooltip()
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
    mapUtils.toBookingIconLayer(
      data.bookings,
      'pickup',
      UIState.highlightBooking
    ),
  ]

  return (
    <>
      <DeckGL
        layers={layers}
        controller={true}
        onClick={(e) => {
          handleClickEvent(e)
        }}
        getCursor={({ isDragging }) =>
          isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
        }
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        onDrag={() => hideTooltip}
        onHover={({ object }) => setHover(Boolean(object))}
      >
        <StaticMap mapStyle="mapbox://styles/izabella123/ckhucn6ed1pwi19mrjwnlcp1b" />
      </DeckGL>
      {UIState.showMapTooltip && (
        <Tooltip position={UIState.lastClickedPosition} />
      )}
    </>
  )
}

export default Map
