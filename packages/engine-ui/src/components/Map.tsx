import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Tooltip from './Tooltip'
import * as hooks from '../utils/hooks'
import * as stores from '../utils/state/stores'

const Map: React.FC = () => {
  const history = useHistory()
  const [isHovering, setHover] = React.useState(false)
  const [viewState, setViewState] = stores.map((state) => [state, state.set])
  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])

  const dataState = stores.dataState(React.useCallback((state) => state, []))
  const mapLayersState = stores.mapLayerState(
    React.useCallback((state) => state, [])
  )

  const showTextLayer = useRouteMatch({
    path: ['/plans/routes/:routeId'],
  })

  const hideTooltip = React.useCallback(
    () => UIState.showMapTooltip && setUIState({ type: 'hideTooltip' }),
    [UIState.showMapTooltip, setUIState]
  )

  const handleClickEvent = React.useCallback(
    (event: any) => {
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
    },
    [hideTooltip, history, setUIState]
  )

  const layers = hooks.useMapLayers(
    dataState,
    mapLayersState,
    UIState,
    handleClickEvent,
    Boolean(showTextLayer)
  )

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
        viewState={viewState as any}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        onDrag={() => hideTooltip}
        onHover={({ object }) => setHover(Boolean(object))}
      >
        <StaticMap
          mapStyle="mapbox://styles/izabella123/ckhucn6ed1pwi19mrjwnlcp1b"
          width="100"
          height="100%"
        />
      </DeckGL>
      {UIState.showMapTooltip && (
        <Tooltip position={UIState.lastClickedPosition} />
      )}
    </>
  )
}

export default Map
