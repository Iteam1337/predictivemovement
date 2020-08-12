import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import Hooks from '../Hooks'
import mapUtils from '../utils/mapUtils'
import { ViewportContext } from '../utils/ViewportContext'
import { useHistory } from 'react-router-dom'

const Map = ({ state, onMapClick }) => {
  const { data } = Hooks.useFilteredStateFromQueryParams(state)
  const history = useHistory()
  const { viewport, setViewport, onLoad } = React.useContext(ViewportContext)
  const [tooltip, setTooltip] = React.useState('')

  const handleClickEvent = (event) => {
    if (!event.object) return
    const type = event.object.properties.type
    switch (type) {
      case 'booking':
        return history.push(`/details?type=booking&id=${event.object.id}`)
      case 'plan':
        return history.push(`/details?type=car&id=${event.object.id}`)
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
      'geojson-cars-layer',
      mapUtils.carToFeature(state.cars),
      handleClickEvent
    ),
    mapUtils.toIconLayer(mapUtils.carIcon(state.cars)),
  ]

  const getAddressFromCoordinates = async ({ pickup, delivery }) => {
    if (!pickup || !delivery) return
    const pickupAddress = await fetch(
      `https://pelias.iteamdev.io/v1/reverse?point.lat=${pickup.lat}&point.lon=${pickup.lon}`
    )
      .then((res) => res.json())
      .then(({ features }) => features[0].properties.label)

    const deliveryAddress = await fetch(
      `https://pelias.iteamdev.io/v1/reverse?point.lat=${delivery.lat}&point.lon=${delivery.lon}`
    )
      .then((res) => res.json())
      .then(({ features }) => features[0].properties.label)
    setTooltip(`${pickupAddress} - ${deliveryAddress}`)
  }

  return (
    <DeckGL
      layers={layers}
      controller={true}
      onClick={(e) => {
        onMapClick(e)
        handleClickEvent(e)
      }}
      viewState={viewport}
      onViewStateChange={({ viewState }) => setViewport(viewState)}
      onLoad={onLoad}
      getTooltip={({ object }) =>
        object &&
        object.properties.address &&
        getAddressFromCoordinates(object.properties.address) &&
        tooltip
      }
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
