import React, { useState } from 'react'
import ReactMapGL, { Popup } from 'react-map-gl'
import CarsLayer from './CarsLayer'
import BookingsLayer from './BookingsLayer'

const Map = () => {
  const [mapState, setMapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 8,
    },
  })

  const [popupInfo, setPopupInfo] = useState(null)

  return (
    <ReactMapGL
      width="100%"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v10"
      pitch={40}
      {...mapState.viewport}
      onViewportChange={viewport => setMapState({ viewport })}
      onClick={event =>
        event.features[0] &&
        !Array.isArray(event.features[0].geometry.coordinates[0])
          ? setPopupInfo({
              carId: event.features[0].id,
              coordinates: event.features[0].geometry.coordinates,
            })
          : setPopupInfo(null)
      }
    >
      {popupInfo && (
        <Popup
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
        >
          {popupInfo.carId && `CarId: ${popupInfo.carId},`}
          Coordinates:
          {`${popupInfo.coordinates[0]} ${popupInfo.coordinates[1]}`}
        </Popup>
      )}

      <CarsLayer />
      <BookingsLayer />
    </ReactMapGL>
  )
}

export default Map
