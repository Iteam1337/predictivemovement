import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import Tooltip from './Tooltip'
import * as stores from '../utils/state/stores'

const Map = ({ layers, handleMapClick }) => {
  const [viewState, setViewState] = stores.map((state) => [state, state.set])
  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])

  const onMapClick = ({ lngLat: [lon, lat], x, y }) =>
    setUIState({
      type: 'lastClickedPosition',
      payload: { lat, lon, x, y },
    })

  const handleDragEvent = () =>
    UIState.showMapTooltip && setUIState({ type: 'hideTooltip' })

  return (
    <>
      <DeckGL
        layers={layers}
        controller={true}
        onClick={(e) => {
          onMapClick(e)
          handleMapClick(e)
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
