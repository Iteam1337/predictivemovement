import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import mapUtils from '../utils/mapUtils'
import { ViewportContext } from '../utils/ViewportContext'
import { useHistory } from 'react-router-dom'
import helpers from '../utils/helpers'

const Map = ({ data, onMapClick, highlightedBooking, includeBookingRoute }) => {
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
        return history.push(`/details?type=vehicle&id=${event.object.id}`)
      default:
        return
    }
  }

  const layers = [
    mapUtils.toBookingIconLayer(
      mapUtils.bookingIcon(data.bookings),
      highlightedBooking
    ),
    mapUtils.toGeoJsonLayer(
      'geojson-cars-layer',
      mapUtils.carToFeature(data.plan),
      handleClickEvent
    ),
    mapUtils.toVehicleIconLayer(mapUtils.carIcon(data.cars)),
  ].concat(
    includeBookingRoute
      ? mapUtils.toGeoJsonLayer(
          'geojson-bookings-layer',
          mapUtils.bookingToFeature(data.bookings),
          handleClickEvent
        )
      : []
  )

  const getAddressFromCoordinates = async ({ pickup, delivery }) => {
    if (!pickup || !delivery) return

    const pickupAddress = await helpers.getAddressFromCoordinate(pickup)
    const deliveryAddress = await helpers.getAddressFromCoordinate(delivery)

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
      getTooltip={({ object }) => {
        return (
          object &&
          object.properties.address &&
          getAddressFromCoordinates(object.properties.address) &&
          tooltip
        )
      }}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default Map
