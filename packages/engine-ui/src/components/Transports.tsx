import React from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import CreateTransport from './CreateTransport'
import TransportsList from './TransportsList'
import TransportDetails from './TransportDetails'
import * as stores from '../utils/state/stores'
import NotFound from './NotFound'
import * as Elements from '../shared-elements'

const Transports: React.FC<{
  createTransport: (params: any) => void
  deleteTransport: (id: string) => void
}> = ({ createTransport, deleteTransport }) => {
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

  return (
    <Switch>
      <Route exact path={path}>
        <h3>Aktuella transporter</h3>
        <TransportsList transports={transports} />
        <Elements.Layout.FlexRowInCenter>
          <Link to={`${url}/add-transport`}>
            <Elements.Buttons.SubmitButton color="#666666">
              + Lägg till transport
            </Elements.Buttons.SubmitButton>
          </Link>
        </Elements.Layout.FlexRowInCenter>
      </Route>
      <Route exact path={`${path}/add-transport`}>
        <CreateTransport onSubmit={createTransport} />
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
