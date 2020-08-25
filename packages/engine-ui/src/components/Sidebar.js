import React from 'react'
import styled from 'styled-components'
import Bookings from './Bookings'
import Cars from './Cars'
import CreateBooking from './CreateBooking'
import CreateBookings from './CreateBookings'
import { Switch as RouterSwitch, Route, Link } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import Hooks from '../utils/hooks'
import CarDetails from './CarDetails'
import AddVehicle from './AddVehicle'
import Plan from './Plan'
import Elements from './Elements'
import Navigation from './Navigation'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: white;
  height: 100vh;
  display: flex;
`

const TextLink = styled(Link)`
  text-decoration: none;
  color: inherit;
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

const AddNewContainer = styled.div`
  margin-top: 1rem;
`

const Details = ({ state }) => {
  const { data, type } = Hooks.useFilteredStateFromQueryParams(state)

  const componentFromType = () => {
    switch (type) {
      case 'booking':
        return <BookingDetails booking={data.bookings[0]} />
      case 'vehicle':
        return <CarDetails car={data.cars[0]} />
      default:
        return null
    }
  }

  return componentFromType()
}

const Sidebar = (state) => {
  const [navigationCurrentView, setNavigationCurrentView] = React.useState(
    'bookings'
  )
  const { data } = Hooks.useFilteredStateFromQueryParams(state)

  const currentViewToElement = () => {
    switch (navigationCurrentView) {
      case 'bookings':
        return (
          <>
            <Bookings bookings={state.bookings} />
            <AddNewContainer>
              <TextLink to="/add-booking">
                <Elements.AddFormFieldButton>
                  + Lägg till bokning
                </Elements.AddFormFieldButton>
              </TextLink>
            </AddNewContainer>
            <AddNewContainer>
              <TextLink to="/add-bookings">
                <Elements.AddFormFieldButton>
                  + Generera historiska bokningar
                </Elements.AddFormFieldButton>
              </TextLink>
            </AddNewContainer>
          </>
        )
      case 'cars':
        return (
          <>
            <h3>Aktuella fordon</h3>
            <Cars cars={state.cars} />
            <TextLink to="/add-vehicle">
              <h3>+ Lägg till bil</h3>
            </TextLink>
          </>
        )
      case 'plan':
        return (
          <PlanWrapper>
            <h3>Plan</h3>
            <Plan plan={state.plan} />
            <Elements.SubmitButton
              justifySelf="center"
              onClick={state.dispatchOffers}
            >
              Bekräfta plan
            </Elements.SubmitButton>
          </PlanWrapper>
        )
      default:
        return null
    }
  }

  return (
    <Container>
      <Navigation
        setNavigationCurrentView={setNavigationCurrentView}
        navigationCurrentView={navigationCurrentView}
      />
      {navigationCurrentView && (
        <Content>
          <RouterSwitch>
            <Route exact path="/">
              <>{currentViewToElement()}</>
            </Route>
            <Route path="/details">
              <Details state={data} />
            </Route>
            <Route path="/add-vehicle">
              <AddVehicle
                currentPosition={state.currentPosition}
                addVehicle={state.addVehicle}
              />
            </Route>
            <Route path="/add-booking">
              <CreateBooking createBooking={state.createBooking} />
            </Route>
            <Route path="/add-bookings">
              <CreateBookings createBookings={state.createBookings} />
            </Route>
          </RouterSwitch>
        </Content>
      )}
    </Container>
  )
}

export default Sidebar
