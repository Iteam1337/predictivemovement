import React from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import AddVehicle from './CreateVehicle'
import Vehicles from './Vehicles'
import VehicleDetails from './VehicleDetails'
import AddFormFieldButton from './forms/inputs/AddFormFieldButton'

const Transports: React.FC<{
  vehicles: any
  addVehicle: any
  deleteVehicle: (id: string) => void
}> = ({ vehicles, addVehicle, deleteVehicle }) => {
  const { path, url } = useRouteMatch()
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
        <VehicleDetails vehicles={vehicles} deleteVehicle={deleteVehicle} />
      </Route>
    </Switch>
  )
}

export default Transports
