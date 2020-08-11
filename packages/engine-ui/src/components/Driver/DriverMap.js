import React, { useState } from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import Hooks from '../../Hooks'
import mapUtils from '../../utils/mapUtils'
import { useLocation } from 'react-router-dom'
const useFilteredDriverFromQueryParams = (state) => {
  // const useQueryParams = () => new URLSearchParams(useLocation().search)
  console.log(state)
  // const type = useQueryParams().get('type')
  // const id = useQueryParams().get('id')
  // const status = useQueryParams().get('status')

  // const statuses = status ? status.split(',') : []
  return state
  // return {
  //   type,
  //   id,
  //   data: {
  //     ...state,
  //     bookings: state.bookings
  //       .filter((item) => (type === 'booking' ? item.id === id : true))
  //       .filter((item) =>
  //         statuses.length ? statuses.includes(item.status) : true
  //       ),
  //     cars: state.cars.filter((item) =>
  //       type === 'car' ? item.id.toString() === id : true
  //     ),
  //   },
  // }
}
const DriverMap = ({ state }) => {
  // const { data } = useFilteredDriverFromQueryParams(state)
  const [layers, setLayers] = React.useState([])
  console.log(state)

  // const layers = [
  //   // mapUtils.toGeoJsonLayer(
  //   //   'geojson-bookings-layer',
  //   //   mapUtils.bookingToFeature(state.activities)
  //   // ),
  //   mapUtils.toGeoJsonLayer(
  //     'geojson-cars-layer',
  //     mapUtils.carToFeature([state])
  //   ),
  //   // mapUtils.toIconLayer(mapUtils.carIcon(state.position)),
  // ]

  const [mapState] = useState({
    viewport: {
      latitude: 61.8294959,
      longitude: 16.0740589,
      zoom: 10,
    },
  })

  React.useEffect(() => {
    if (state && state.position) {
      setLayers([
        // mapUtils.toGeoJsonLayer(
        //   'geojson-bookings-layer',
        //   mapUtils.bookingToFeature(state.activities)
        // ),
        mapUtils.toGeoJsonLayer(
          'geojson-cars-layer',
          mapUtils.carToFeature([state])
        ),
        mapUtils.toIconLayer(mapUtils.carIcon([state])),
      ])
    }
  }, [state])

  return (
    <DeckGL
      initialViewState={
        state && state.position
          ? {
              viewport: {
                latitude: state.position.lat,
                longitude: state.position.lon,
              },
            }
          : mapState.viewport
      }
      layers={layers}
      controller={true}
    >
      <StaticMap mapStyle="mapbox://styles/mapbox/dark-v10" />
    </DeckGL>
  )
}

export default DriverMap
