import React from 'react'
import { UIStateContext } from '../utils/UIStateContext'
import Elements from '../shared-elements/'
import { FlyToInterpolator } from 'react-map-gl'
import helpers from '../utils/helpers'

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
        <Elements.Layout.InlineContainer key={vehicle.id}>
          <Elements.Typography.NoMarginParagraph>
            ID
          </Elements.Typography.NoMarginParagraph>
          <Elements.Layout.MarginLeftContainerSm>
            <Elements.Links.RoundedLink
              onMouseOver={() =>
                dispatch({ type: 'highlightVehicle', payload: vehicle.id })
              }
              onMouseLeave={() =>
                dispatch({ type: 'highlightVehicle', payload: undefined })
              }
              to={`/transports/${vehicle.id}`}
              onClick={() =>
                onClickHandler(
                  vehicle.start_address.lat,
                  vehicle.start_address.lon
                )
              }
            >
              {helpers.formatIdAsFourChar(vehicle.id)}
            </Elements.Links.RoundedLink>
          </Elements.Layout.MarginLeftContainerSm>
        </Elements.Layout.InlineContainer>
      ))}
    </Elements.Layout.LinkListContainer>
  )
}

export default Vehicles
