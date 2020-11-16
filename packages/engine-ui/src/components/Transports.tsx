import React from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import CreateTransport from './CreateTransport'
import TransportsList from './TransportsList'
import TransportDetails from './TransportDetails'
import { Transport } from '../types'
import NotFound from './NotFound'
import * as Elements from '../shared-elements'

const Transports: React.FC<{
  transports: Transport[]
  createTransport: (params: any) => void
  deleteTransport: (id: string) => void
}> = ({ transports, createTransport, deleteTransport }) => {
  const { path, url } = useRouteMatch()

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
          transports={transports}
          deleteTransport={deleteTransport}
        />
      </Route>
      <Route component={NotFound} />
    </Switch>
  )
}

export default Transports
