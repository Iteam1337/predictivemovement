import React from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import AddVehicle from './CreateVehicle'
import TransportsList from './TransportsList'
import TransportDetails from './TransportDetails'
import * as stores from '../utils/state/stores'
import { Transport } from '../types'
import * as Elements from '../shared-elements'

const Transports: React.FC<{
  transports: Transport[]
  addVehicle: (params: any) => void
  deleteVehicle: (id: string) => void
}> = ({ transports, addVehicle, deleteVehicle }) => {
  const setMapFilters = stores.mapFilters((state) => state.set)

  React.useEffect(() => {
    setMapFilters({ transports: true })
  }, [setMapFilters])

  const { path, url } = useRouteMatch()
  const setUIState = stores.ui((state) => state.dispatch)

  return (
    <Switch>
      <Route exact path={path}>
        <h3>Aktuella transporter</h3>
        <TransportsList transports={transports} />
        <Elements.Layout.FlexRowInCenter>
          <Link to={`${url}/add-vehicle`}>
            <Elements.Buttons.SubmitButton color="#666666">
              + Lägg till transport
            </Elements.Buttons.SubmitButton>
          </Link>
        </Elements.Layout.FlexRowInCenter>
      </Route>
      <Route path={`${path}/add-vehicle`}>
        <AddVehicle onSubmit={addVehicle} />
      </Route>
      <Route path={`${path}/:vehicleId`}>
        <TransportDetails
          transports={transports}
          deleteTransport={deleteVehicle}
          onUnmount={() =>
            setUIState({ type: 'highlightTransport', payload: undefined })
          }
        />
      </Route>
    </Switch>
  )
}

export default Transports
