import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import * as mapUtils from '../utils/mapUtils'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Tooltip from './Tooltip'

import * as stores from '../utils/state/stores'

const Map = ({ layers, state }) => {
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
    const type = event.object.properties?.type

    if (!type) {
      return
    }

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
