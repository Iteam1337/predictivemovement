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
    <Switch>
      <Route exact path={path}>
        {sortedFleets &&
          sortedFleets.map((fleet, i) => {
            return (
              <Elements.Layout.MarginBottomContainer key={i}>
                <TransportsList
                  transports={sortedTransports}
                  fleet={fleet}
                  sortedFleets={sortedFleets}
                />
                <Elements.Layout.FlexRowInCenter>
                  <Link to={`${url}/add-transport/${fleet}`}>
                    <Elements.Buttons.SubmitButton color="#666666">
                      + Lägg till transport
                    </Elements.Buttons.SubmitButton>
                  </Link>
                </Elements.Layout.FlexRowInCenter>
              </Elements.Layout.MarginBottomContainer>
            )
          })}
        {sortedFleets.length === 0 && (
          <>
            <Elements.Typography.CleanH4>
              Aktuella transporter
            </Elements.Typography.CleanH4>
            <Elements.Layout.MarginBottomContainer />
            <Elements.Typography.NoInfoParagraph>
              Det finns inga aktuella transporter...
            </Elements.Typography.NoInfoParagraph>
            <Elements.Layout.FlexRowInCenter>
              <Link to={`${url}/add-transport`}>
                <Elements.Buttons.SubmitButton color="#666666">
                  + Lägg till transport
                </Elements.Buttons.SubmitButton>
              </Link>
            </Elements.Layout.FlexRowInCenter>
          </>
        )}
      </Route>

      <Route path={`${path}/add-transport`}>
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
