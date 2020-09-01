import React from 'react'
import styled from 'styled-components'
import Bookings from './Bookings'
// import Cars from './Cars'
// import CreateBooking from './CreateBooking'
// import CreateBookings from './CreateBookings'
import { Switch as RouterSwitch, Route } from 'react-router-dom'
// import BookingDetails from './BookingDetails'
// import Hooks from '../utils/hooks'
// import CarDetails from './CarDetails'

// import AddVehicle from './AddVehicle'
import Plan from './Plan'
import Elements from '../shared-elements'
import Navigation from './Navigation'
import Transports from './Transports'

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
`

const PlanWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
`
const Sidebar = (state) => {
  return (
    <Container>
      <Navigation />
      <Content>
        <RouterSwitch>
          <Route path="/bookings">
            <Bookings
              bookings={state.bookings}
              createBookings={state.createBookings}
              createBooking={state.createBooking}
            />
          </Route>

          <Route path="/transports">
            <Transports cars={state.cars} addVehicle={state.addVehicle} />
          </Route>

          <Route path="/plans">
            <PlanWrapper>
              <h3>Plan</h3>
              <Plan plan={state.plan} />
              <Elements.Buttons.SubmitButton
                justifySelf="center"
                onClick={state.dispatchOffers}
              >
                Bekräfta plan
              </Elements.Buttons.SubmitButton>
            </PlanWrapper>
          </Route>
        </RouterSwitch>
      </Content>
    </Container>
  )
}

export default Sidebar
