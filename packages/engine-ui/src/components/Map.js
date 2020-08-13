import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import hooks from '../hooks'
import mapUtils from '../utils/mapUtils'

const Map = ({ state, onMapClick }) => {
  const { data } = hooks.useFilteredStateFromQueryParams(state)

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
      initialViewState={mapState.viewport}
      layers={layers}
      controller={true}
      onClick={onMapClick}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
