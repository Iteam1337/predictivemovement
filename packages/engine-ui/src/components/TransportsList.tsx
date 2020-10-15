import React from 'react'
import { UIStateContext } from '../utils/UIStateContext'
import Elements from '../shared-elements'
import { FlyToInterpolator } from 'react-map-gl'
import helpers from '../utils/helpers'
import { Transport } from '../types'

const TransportsList: React.FC<{ transports: Transport[] }> = ({
  transports,
}) => {
  const { dispatch } = React.useContext(UIStateContext)
  if (!transports.length)
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
    <Elements.Layout.TransportsList>
      {transports.map((transport) => (
        <li key={transport.id}>
          <Elements.Links.RoundedLink
            color={transport.color}
            onMouseOver={() =>
              dispatch({ type: 'highlightTransport', payload: transport.id })
            }
            onMouseLeave={() =>
              dispatch({ type: 'highlightTransport', payload: undefined })
            }
            to={`/transports/${transport.id}`}
            onClick={() =>
              onClickHandler(
                transport.start_address.lat,
                transport.start_address.lon
              )
            }
          >
            {helpers.getLastFourChars(transport.id).toUpperCase()}
          </Elements.Links.RoundedLink>
        </li>
      ))}
    </Elements.Layout.TransportsList>
  )
}

export default TransportsList
