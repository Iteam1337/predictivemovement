import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import mapUtils from '../utils/mapUtils'
import DeckGL from '@deck.gl/react'

const Map = ({ dispatch, state }) => {
  const [mapState] = useState({
    viewport: {
      latitude: 57.6874841,
      longitude: 11.7650999,
      zoom: 10,
    },
  })

  const dispatcher = (type) => (object) =>
    dispatch({
      type,
      payload: {
        ...object,
      },
    })

  return (
    <DeckGL
      initialViewState={mapState.viewport}
      layers={[
        mapUtils.toGeoJsonLayer(
          'geojson-carbookings-layer',
          state.carBookingLineCollection,
          dispatcher('setCarBookingLines')
        ),
        mapUtils.toGeoJsonLayer(
          'geojson-bookings-layer',
          state.bookingCollection,
          () => {}
        ),
        mapUtils.toIconLayer(
          state.movingCarsCollection,
          dispatcher('setCarBookingLine')
        ),
      ]}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
