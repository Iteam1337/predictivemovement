import React from 'react'
import { UIStateContext } from '../utils/UIStateContext'
import Elements from '../shared-elements/'
import { FlyToInterpolator } from 'react-map-gl'
import helpers from '../utils/helpers'
import { Transport } from '../types'

const Vehicles: React.FC<{ vehicles: Transport[] }> = ({ vehicles }) => {
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
          <Elements.Links.RoundedLink
            color={vehicle.color}
            onMouseOver={() =>
              dispatch({ type: 'highlightTransport', payload: vehicle.id })
            }
            onMouseLeave={() =>
              dispatch({ type: 'highlightTransport', payload: undefined })
            }
            to={`/transports/${vehicle.id}`}
            onClick={() =>
              onClickHandler(
                vehicle.start_address.lat,
                vehicle.start_address.lon
              )
            }
          >
            {helpers.getLastFourChars(vehicle.id).toUpperCase()}
          </Elements.Links.RoundedLink>
        </Elements.Layout.InlineContainer>
      ))}
    </Elements.Layout.LinkListContainer>
  )
}

export default Vehicles
