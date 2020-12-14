import React from 'react'
import * as stores from '../utils/state/stores'
import * as Elements from '../shared-elements/'
import { FlyToInterpolator } from 'react-map-gl'
import * as helpers from '../utils/helpers'
import { Transport } from '../types'

const TransportsList: React.FC<{ transports: Transport[] }> = ({
  transports,
}) => {
  const setMap = stores.map((state) => state.set)
  const setUIState = stores.ui((state) => state.dispatch)

  if (!transports.length)
    return (
      <Elements.Typography.NoInfoParagraph>
        Det finns inga aktuella transporter...
      </Elements.Typography.NoInfoParagraph>
    )

  const onClickHandler = (lat: number, lon: number) =>
    setMap({
      latitude: lat,
      longitude: lon,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t: number) => t * (2 - t),
    })

  return (
    <Elements.Layout.TransportsList>
      {transports.map((transport) => (
        <li key={transport.id}>
          <Elements.Links.RoundedLink
            color={transport.color}
            onMouseOver={() =>
              setUIState({ type: 'highlightTransport', payload: transport.id })
            }
            onMouseLeave={() =>
              setUIState({ type: 'highlightTransport', payload: undefined })
            }
            to={`/transports/${transport.id}`}
            onClick={() =>
              onClickHandler(
                transport.startAddress.lat,
                transport.startAddress.lon
              )
            }
          >
            {transport.metadata?.profile?.toUpperCase() ||
              helpers.getLastFourChars(transport.id).toUpperCase()}
          </Elements.Links.RoundedLink>
        </li>
      ))}
    </Elements.Layout.TransportsList>
  )
}

export default TransportsList
