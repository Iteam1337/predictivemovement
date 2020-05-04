import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import mapUtils from '../utils/mapUtils'
import DeckGL from '@deck.gl/react'

const Map = ({ dispatch, state }) => {
  const [mapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 10,
    },
  })

  const dispatcher = (type) => (object) =>
    dispatch({ type, payload: { ...object } })

  return (
    <DeckGL
      initialViewState={mapState.viewport}
      layers={[
        mapUtils.toGeoJsonLayer(
          'geojson-carline-layer',
          state.carLineCollection,
          dispatcher('setCarInfo')
        ),
        mapUtils.toGeoJsonLayer(
          'geojson-cars-layer',
          state.carCollection,
          dispatcher('setCarInfo')
        ),
        mapUtils.toGeoJsonLayer(
          'geojson-bookings-layer',
          state.bookingCollection,
          () => {}
        ),
        mapUtils.toIconLayer(state.movingCarsCollection),
      ]}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
