import React from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import CreateTransport from './CreateTransport'
import TransportsList from './TransportsList'
import TransportDetails from './TransportDetails'
import * as stores from '../utils/state/stores'
import NotFound from './NotFound'
import * as Elements from '../shared-elements'
import EditTransport from './EditTransport'

const Transports: React.FC<{
  createTransport: (params: any) => void
  deleteTransport: (id: string) => void
  updateTransport: (params: any) => void
}> = ({ createTransport, deleteTransport, updateTransport }) => {
  const { path, url } = useRouteMatch()
  const setMapLayers = stores.mapLayerState((state) => state.set)
  const setUIState = stores.ui((state) => state.dispatch)
  const transports = stores.dataState((state) => state.transports)
  const transportsRootView = useRouteMatch({
    path: '/transports',
    strict: true,
  })

  React.useEffect(() => {
    if (transportsRootView?.isExact) {
      setMapLayers({ type: 'transportIcons' })
    }
  }, [setMapLayers, transports, transportsRootView])

  const onTransportDetailsMount = React.useCallback(
    () => setUIState({ type: 'highlightTransport', payload: undefined }),
    [setUIState]
  )

  const onTransportDetailsUnmount = React.useCallback(
    () => setMapLayers({ type: 'transportIcons' }),
    [setMapLayers]
  )

  const fleets = Array.from(
    new Set(transports.map((transport) => transport.metadata.fleet))
  )

  fleets.sort((a, b) => (a === '' ? 1 : b === '' ? -1 : 0))

  transports.sort((a, b) =>
    a.metadata.profile.localeCompare(b.metadata.profile)
  )

  return (
    <Switch>
      <Route exact path={path}>
        {fleets &&
          fleets.map((fleet, i) => {
            return (
              <Elements.Layout.MarginBottomContainer key={i}>
                <TransportsList
                  transports={transports}
                  fleet={fleet}
                  sortedFleets={fleets}
                />

                {fleet ? (
                  <Elements.Layout.FlexRowInCenterMarginS>
                    <Link to={`${url}/add-transport/${fleet}`}>
                      <Elements.Buttons.SubmitButton color="#666666">
                        + Lägg till transport
                      </Elements.Buttons.SubmitButton>
                    </Link>
                  </Elements.Layout.FlexRowInCenterMarginS>
                ) : null}
              </Elements.Layout.MarginBottomContainer>
            )
          })}
        {fleets.length === 0 && (
          <>
            <Elements.Typography.CleanH4>
              Aktuella transporter
            </Elements.Typography.CleanH4>
            <Elements.Layout.MarginBottomContainer />
            <Elements.Typography.NoInfoParagraph>
              Det finns inga aktuella transporter...
            </Elements.Typography.NoInfoParagraph>
            <Elements.Layout.FlexRowInCenterMarginS>
              <Link to={`${url}/add-transport/`}>
                <Elements.Buttons.SubmitButton color="#666666">
                  + Lägg till transport
                </Elements.Buttons.SubmitButton>
              </Link>
            </Elements.Layout.FlexRowInCenterMarginS>
          </>
        )}

        {transports.length > 0 ? (
          <Elements.Layout.FlexRowInCenterMarginL>
            <Link to={`${url}/add-transport/`}>
              <Elements.Buttons.SubmitButton color="#666666">
                + Skapa Transport
              </Elements.Buttons.SubmitButton>
            </Link>
          </Elements.Layout.FlexRowInCenterMarginL>
        ) : null}
      </Route>

      <Route exact path={`${path}/add-transport/:fleet?`}>
        <CreateTransport onSubmit={createTransport} />
      </Route>
      <Route exact path={`${path}/edit-transport/:transportId`}>
        <EditTransport
          transports={transports}
          updateTransport={updateTransport}
        />
      </Route>
      <Route exact path={`${path}/:transportId`}>
        <TransportDetails
          onMount={onTransportDetailsMount}
          onUnmount={onTransportDetailsUnmount}
          deleteTransport={deleteTransport}
        />
      </Route>

      <Route component={NotFound} />
    </Switch>
  )
}

export default Transports
