import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import hooks from '../utils/hooks'
import mapUtils from '../utils/mapUtils'
import { ViewportContext } from '../utils/ViewportContext'
import { useHistory, useLocation } from 'react-router-dom'

const Map = ({ state, onMapClick }) => {
  const { data } = hooks.useFilteredStateFromQueryParams(state)
  const history = useHistory()
  const location = useLocation()
  const [showBookingRoute, setShowBookingRoute] = React.useState(false)
  const [active, setActive] = React.useState(false)
  const { viewport, setViewport, onLoad } = React.useContext(ViewportContext)
  const [tooltip, setTooltip] = React.useState('')

  React.useEffect(() => {
    setShowBookingRoute(location.search.includes('booking'))
    setActive(location.search)
  }, [location.search])

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
    showBookingRoute &&
      mapUtils.toGeoJsonLayer(
        'geojson-bookings-layer',
        mapUtils.bookingToFeature(data.bookings),
        handleClickEvent
      ),
    mapUtils.toIconLayer(mapUtils.bookingIcon(state.bookings), active),
    mapUtils.toGeoJsonLayer(
      'geojson-cars-layer',
      mapUtils.carToFeature(state.plan),
      handleClickEvent
    ),

    mapUtils.toIconLayer(mapUtils.carIcon(state.cars), active),
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
