import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'

const Map = ({ layers }) => {
  const [mapState] = useState({
    viewport: {
      latitude: 57.6874841,
      longitude: 11.7650999,
      zoom: 10,
    },
  })

  return (
    <DeckGL
      initialViewState={mapState.viewport}
      layers={layers}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
