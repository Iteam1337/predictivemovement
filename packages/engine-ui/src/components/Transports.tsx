import React from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import AddVehicle from './CreateVehicle'
import TransportsList from './TransportsList'
import TransportDetails from './TransportDetails'
import AddFormFieldButton from './forms/inputs/AddFormFieldButton'
import stores from '../utils/state/stores'
import { Transport } from '../types'

const Transports: React.FC<{
  transports: Transport[]
  addVehicle: () => void
  deleteVehicle: (id: string) => void
}> = ({ transports, addVehicle, deleteVehicle }) => {
  const { path, url } = useRouteMatch()
  const dispatch = stores.ui((state) => state.dispatch)

  return (
    <Switch>
      <Route exact path={path}>
        <h3>Aktuella transporter</h3>
        <TransportsList transports={transports} />
        <Link to={`${url}/add-vehicle`}>
          <AddFormFieldButton onClickHandler={null}>
            + Lägg till transport
          </AddFormFieldButton>
        </Link>
      </Route>
      <Route path={`${path}/add-vehicle`}>
        <AddVehicle onSubmit={addVehicle} />
      </Route>
      <Route path={`${path}/:vehicleId`}>
        <TransportDetails
          transports={transports}
          deleteTransport={deleteVehicle}
          onUnmount={() =>
            dispatch({ type: 'highlightTransport', payload: undefined })
          }
        />
      </Route>
    </Switch>
  )
}

export default Transports
