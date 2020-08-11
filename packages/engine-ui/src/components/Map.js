import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import Hooks from '../Hooks'
import mapUtils from '../utils/mapUtils'
import { ViewportContext } from '../utils/ViewportContext'

const Map = ({ state, onMapClick }) => {
  const { data } = Hooks.useFilteredStateFromQueryParams(state)
  const { viewport, setViewport, onLoad } = React.useContext(ViewportContext)

  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(data.bookings)
    ),

    mapUtils.toGeoJsonLayer(
      'geojson-cars-layer',
      mapUtils.carToFeature(state.cars)
    ),
    mapUtils.toIconLayer(mapUtils.carIcon(state.cars)),
  ]

  const [mapState] = useState({
    viewport: {
      latitude: 61.8294959,
      longitude: 16.0740589,
      zoom: 10,
    },
  })

  return (
    <DeckGL
      layers={layers}
      controller={true}
      onClick={onMapClick}
      viewState={viewport}
      onViewStateChange={({ viewState }) => setViewport(viewState)}
      onLoad={onLoad}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
