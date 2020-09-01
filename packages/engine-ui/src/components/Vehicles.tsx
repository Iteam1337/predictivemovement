import React from 'react'
import { UIStateContext } from '../utils/UIStateContext'
import Elements from '../shared-elements/'
import { FlyToInterpolator } from 'react-map-gl'

type Vehicle = {
  id: string
  start_address: { lon: number; lat: number }
}

const Vehicles: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  const { dispatch } = React.useContext(UIStateContext)
  if (!vehicles.length)
    return (
      <Elements.Typography.NoInfoParagraph>
        Det finns inga aktuella transporter...
      </Elements.Typography.NoInfoParagraph>
    )

  const onClickHandler = (lat: number, lon: number) =>
    dispatch({
      type: 'viewport',
      payload: {
        latitude: lat,
        longitude: lon,
        zoom: 10,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t: number) => t * (2 - t),
      },
    })
  return (
    <Elements.Layout.LinkListContainer>
      {vehicles.map((vehicle) => (
        <Elements.Links.RoundedLink
          onMouseOver={() =>
            dispatch({ type: 'highlightVehicle', payload: vehicle.id })
          }
          onMouseLeave={() =>
            dispatch({ type: 'highlightVehicle', payload: undefined })
          }
          to={`/details?type=vehicle&id=${vehicle.id}`}
          key={vehicle.id}
          onClick={() =>
            onClickHandler(vehicle.start_address.lat, vehicle.start_address.lon)
          }
        >
          {vehicle.id}
        </Elements.Links.RoundedLink>
      ))}
    </Elements.Layout.LinkListContainer>
  )
}

export default Vehicles
