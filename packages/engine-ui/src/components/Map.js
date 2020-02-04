import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import mapUtils from '../utils/mapUtils'
import DeckGL from '@deck.gl/react'
import { IconLayer } from '@deck.gl/layers'
import markerIcon from '../car.svg'

const Map = ({ dispatch, state }) => {
  const [mapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 10,
    },
  })

  const dispatcher = type => object =>
    dispatch({ type, payload: { ...object } })

  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 160, height: 138, mask: true },
  }
  const toIconLayer = data => {
    const iconData = data.features.map(feature => ({
      coordinates: feature.geometry.coordinates,
    }))

    return new IconLayer({
      id: 'icon-layer',
      data: iconData,
      pickable: true,
      // iconAtlas and iconMapping are required
      // getIcon: return a string
      iconAtlas: markerIcon,
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',

      sizeScale: 4,
      getPosition: d => d.coordinates,
      getSize: d => 5,
      getColor: d => [Math.sqrt(d.exits), 140, 0],
      onHover: ({ object, x, y }) => {
        const tooltip = `${object.name}\n${object.address}`
        /* Update tooltip
         http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      */
      },
    })
  }
  return (
    <DeckGL
      initialViewState={mapState.viewport}
      layers={[
        toIconLayer(state.movingCarsCollection),
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
        mapUtils.toGeoJsonLayer(
          'geojson-moving-cars-layer',
          state.movingCarsCollection,
          () => {}
        ),
      ]}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
