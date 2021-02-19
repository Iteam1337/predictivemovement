import React from 'react'
import * as stores from '../utils/state/stores'
import * as Elements from '../shared-elements/'
import * as helpers from '../utils/helpers'
import { Transport } from '../types'
import { Link, useRouteMatch } from 'react-router-dom'

const TransportsList: React.FC<{ transports: Transport[] }> = ({
  transports,
}) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const { url } = useRouteMatch()

  if (!transports.length)
    return (
      <Elements.Typography.NoInfoParagraph>
        Det finns inga aktuella transporter...
      </Elements.Typography.NoInfoParagraph>
    )

  const sortedFleets: string[] = []

  transports.map((transport) => {
    if (sortedFleets.includes(transport.metadata.fleet)) {
      return null
    }
    sortedFleets.push(transport.metadata.fleet)

    return null
  })

  const sortedTransports = transports.sort((a, b) =>
    a.metadata.profile.localeCompare(b.metadata.profile)
  )

  return (
    <Elements.Layout.TransportsList>
      {sortedFleets &&
        sortedFleets.map((fleet) => {
          return (
            <div>
              <h3>
                {fleet === '' && sortedFleets.length === 1
                  ? 'Aktuella Transporter'
                  : fleet === '' && sortedFleets.length > 1
                  ? 'Övriga Transporter'
                  : fleet}
              </h3>

              {sortedTransports.map((transport) => {
                if (transport.metadata.fleet === fleet) {
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
                } else return null
              })}
              <Elements.Layout.FlexRowInCenter>
                <Link to={`${url}/add-transport`}>
                  <Elements.Buttons.SubmitButton color="#666666">
                    + Lägg till transport
                  </Elements.Buttons.SubmitButton>
                </Link>
              </Elements.Layout.FlexRowInCenter>
            </div>
          )
        })}
    </Elements.Layout.TransportsList>
  )
}

export default TransportsList
