import React from 'react'
import * as stores from '../utils/state/stores'
import * as Elements from '../shared-elements/'
import * as helpers from '../utils/helpers'
import { Transport } from '../types'

const TransportsList: React.FC<{ transports: Transport[] }> = ({
  transports,
}) => {
  const setUIState = stores.ui((state) => state.dispatch)

  if (!transports.length)
    return (
      <Elements.Typography.NoInfoParagraph>
        Det finns inga aktuella transporter...
      </Elements.Typography.NoInfoParagraph>
    )

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
