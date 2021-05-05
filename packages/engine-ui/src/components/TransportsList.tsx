import React from 'react'
import * as stores from '../utils/state/stores'
import * as Elements from '../shared-elements/'
import * as helpers from '../utils/helpers'
import { Transport } from '../types'

const TransportsList: React.FC<{
  transports: Transport[]
  fleet: string
  sortedFleets: string[]
}> = ({ transports, fleet, sortedFleets }) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)
  const [isOpen, setIsOpen] = React.useState(true)

  const filteredTransports = transports.filter(
    (t) => t.metadata.fleet === fleet
  )

  if (!filteredTransports.length)
    return (
      <Elements.Typography.NoInfoParagraph>
        Det finns inga aktuella transporter...
      </Elements.Typography.NoInfoParagraph>
    )

  return (
    <Elements.Layout.TransportsList>
      <Elements.Layout.FlexRowWrapper
        onClick={() => setIsOpen((current) => !current)}
      >
        <Elements.Icons.Chevron
          active={isOpen.toString()}
          style={{
            width: isOpen ? '16px' : '13px',
            marginRight: isOpen ? '0.7rem' : '0.875rem',
          }}
        />
        <Elements.Typography.CleanH3>
          {fleet === '' && sortedFleets.length === 1
            ? 'Aktuella Transporter'
            : fleet === '' && sortedFleets.length > 1
            ? 'Övriga Transporter'
            : fleet}
        </Elements.Typography.CleanH3>
        <Elements.Layout.MarginBottomContainer />
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
                onClick={() =>
                  helpers.focusMapOnClick(
                    transport.startAddress.lat,
                    transport.startAddress.lon,
                    setMap
                  )
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
