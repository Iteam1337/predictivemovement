import React from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import AddVehicle from './CreateVehicle'
import Vehicles from './Vehicles'
import TransportDetails from './TransportDetails'
import AddFormFieldButton from './forms/inputs/AddFormFieldButton'
import stores from '../utils/state/stores'

const Transports: React.FC<{
  vehicles: any
  addVehicle: any
  deleteVehicle: (id: string) => void
}> = ({ vehicles, addVehicle, deleteVehicle }) => {
  const { path, url } = useRouteMatch()
  const dispatch = stores.ui((state) => state.dispatch)

  return (
    <Switch>
      <Route exact path={path}>
        <h3>Aktuella transporter</h3>
        <Vehicles vehicles={vehicles} />
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
          transports={vehicles}
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
