import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import mapUtils from '../utils/mapUtils'
import { UIStateContext } from '../utils/UIStateContext'
import { useHistory } from 'react-router-dom'
import Tooltip from './Tooltip'

const Map = ({ data }) => {
  const history = useHistory()

  const { state: UIState, dispatch, onLoad } = React.useContext(UIStateContext)

  const handleClickEvent = (event) => {
    if (!event.object) return
    const type = event.object.properties.type
    switch (type) {
      case 'booking':
        return history.push(`/bookings/${event.object.id}`)
      case 'plan':
        return history.push(`/transports/${event.object.id}`)
      default:
        return
    }
  }

  const onMapClick = ({ lngLat: [lon, lat], x, y }) =>
    dispatch({
      type: 'lastClickedPosition',
      payload: { lat, lon, x, y },
    })

  const layers = [
    mapUtils.toIconLayer(
      mapUtils.bookingIcon(data.bookings),
      UIState.highlightBooking
    ),
    mapUtils.toGeoJsonLayer(
      'geojson-cars-layer',
      mapUtils.carToFeature(data.plan),
      handleClickEvent
    ),
    mapUtils.toIconLayer(
      mapUtils.vehicleIcon(data.cars),
      UIState.highlightVehicle
    ),
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',

      mapUtils.bookingToFeature(data.bookings),
      handleClickEvent
    ),
  ]

  const handleDragEvent = () =>
    UIState.showMapTooltip && dispatch({ type: 'hideTooltip' })

  return (
    <>
      <DeckGL
        layers={layers}
        controller={true}
        onClick={(e) => {
          onMapClick(e)
          handleClickEvent(e)
        }}
        viewState={UIState.viewport}
        onViewStateChange={({ viewState }) =>
          dispatch({ type: 'viewport', payload: viewState })
        }
        onLoad={onLoad}
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
