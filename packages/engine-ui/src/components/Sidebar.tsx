import React from 'react'
import styled from 'styled-components'
import Bookings from './Bookings'
import { Switch as RouterSwitch, Route, Redirect } from 'react-router-dom'
import Plan from './Plan'
import Navigation from './Navigation'
import Transports from './Transports'
import { Booking, Route as PlanRoute } from '../types'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: white;
  height: 100vh;
  display: flex;
`

const Content = styled.div`
  padding: 2rem;
  width: 350px;
  overflow: auto;
`

interface Props {
  bookings: Booking[]
  plan: PlanRoute[]
  vehicles: any
  createBooking: () => void
  deleteBooking: () => void
  dispatchOffers: () => void
  addVehicle: () => void
  deleteVehicle: (id: string) => void
}

const Sidebar = (state: Props) => {
  return (
    <Container>
      <Navigation />
      <RouterSwitch>
        <Route exact path="/">
          <Redirect from="/" to="/bookings" />
        </Route>
        <Route>
          <Content>
            <RouterSwitch>
              <Route path="/bookings">
                <Bookings
                  bookings={state.bookings}
                  createBooking={state.createBooking}
                  deleteBooking={state.deleteBooking}
                />
              </Route>
              <Route path="/transports">
                <Transports
                  vehicles={state.vehicles}
                  addVehicle={state.addVehicle}
                  deleteVehicle={state.deleteVehicle}
                />
              </Route>
              <Route path="/plans">
                <Plan plan={state.plan} dispatchOffers={state.dispatchOffers} />
              </Route>
            </RouterSwitch>
          </Content>
        </Route>
      </RouterSwitch>
    </Container>
  )
}

export default Sidebar
