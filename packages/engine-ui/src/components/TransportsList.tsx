import React from 'react'
import * as stores from '../utils/state/stores'
import * as Elements from '../shared-elements/'
import * as helpers from '../utils/helpers'
import * as Icons from '../assets/Icons'
import { Transport } from '../types'

const TransportsList: React.FC<{
  transports: Transport[]
  fleet: string
  sortedFleets: string[]
}> = ({ transports, fleet, sortedFleets }) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const [isOpen, setIsOpen] = React.useState(false)

  if (!transports.length)
    return (
      <Elements.Typography.NoInfoParagraph>
        Det finns inga aktuella transporter...
      </Elements.Typography.NoInfoParagraph>
    )

  const filteredTransports = transports.filter(
    (t) => t.metadata.fleet === fleet
  )

  return (
    <Elements.Layout.TransportsList>
      <Elements.Layout.FlexRowWrapper
        onClick={() => setIsOpen((current) => !current)}
      >
        <Elements.Typography.CleanH4>
          {fleet === '' && sortedFleets.length === 1
            ? 'Aktuella Transporter'
            : fleet === '' && sortedFleets.length > 1
            ? 'Övriga Transporter'
            : fleet}
        </Elements.Typography.CleanH4>
        <Elements.Layout.MarginBottomContainer />

        <Icons.Arrow
          style={{
            marginLeft: '0.875rem',
            transform: `rotate(${isOpen ? '180deg' : 0})`,
          }}
        />
      </Elements.Layout.FlexRowWrapper>
      {isOpen &&
        filteredTransports.map((transport) => {
          return (
            <li key={transport.id}>
              <Elements.Links.RoundedLink
                color={transport.color}
                onMouseOver={() =>
                  setUIState({
                    type: 'highlightTransport',
                    payload: transport.id,
                  })
                }
                onMouseLeave={() =>
                  setUIState({
                    type: 'highlightTransport',
                    payload: undefined,
                  })
                }
                to={`/transports/${transport.id}`}
              >
                {transport.metadata?.profile?.toUpperCase() ||
                  helpers.getLastFourChars(transport.id).toUpperCase()}
              </Elements.Links.RoundedLink>
            </li>
          )
        })}
    </Elements.Layout.TransportsList>
  )
}

export default TransportsList
