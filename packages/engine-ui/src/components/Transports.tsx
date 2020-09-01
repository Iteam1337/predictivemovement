import React from 'react'
import { Link, Route, useRouteMatch } from 'react-router-dom'
import AddVehicle from './AddVehicle'
import Cars from './Cars'
import CarDetails from './VehicleDetails'
import AddFormFieldButton from './forms/inputs/AddFormFieldButton'

const Transports: React.FC<{
  cars: any
  addVehicle: any
}> = ({ cars, addVehicle }) => {
  const { path, url } = useRouteMatch()
  return (
    <>
      <Route exact path={path}>
        <h3>Aktuella transporter</h3>
        <Cars cars={cars} />
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
        <CarDetails vehicles={cars} />
      </Route>
    </>
  )
}

export default Transports
