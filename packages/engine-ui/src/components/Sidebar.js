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
import Elements from '../shared-elements'
import Navigation from './Navigation'
import { UIStateContext } from '../utils/UIStateContext'

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

const AddNewContainer = styled.div`
  margin-top: 1rem;
`

const AddFormFieldButton = ({
  onClickHandler,
  children,
  marginTop = '5rem',
}) => (
  <Elements.Buttons.StyledAddFormFieldButton
    type="button"
    onClick={onClickHandler}
    marginTop={marginTop}
  >
    {children}
  </Elements.Buttons.StyledAddFormFieldButton>
)

const Details = ({ state }) => {
  const { data, type } = Hooks.useFilteredStateFromQueryParams(state)
  const { dispatch } = React.useContext(UIStateContext)

  const componentFromType = () => {
    switch (type) {
      case 'booking':
        return (
          <BookingDetails
            booking={data.bookings[0]}
            onClickHandler={() =>
              dispatch({ type: 'highlightBooking', payload: undefined })
            }
          />
        )
      case 'vehicle':
        return <CarDetails vehicle={data.cars[0]} />
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
              <Link to="/add-booking">
                <AddFormFieldButton>+ Lägg till bokning</AddFormFieldButton>
              </Link>
            </AddNewContainer>
            <AddNewContainer>
              <Link to="/add-bookings">
                <AddFormFieldButton marginTop="0">
                  + Generera historiska bokningar
                </AddFormFieldButton>
              </Link>
            </AddNewContainer>
          </>
        )
      case 'cars':
        return (
          <>
            <h3>Aktuella transporter</h3>
            <Cars cars={state.cars} />
            <Link to="/add-vehicle">
              <AddFormFieldButton>+ Lägg till transport</AddFormFieldButton>
            </Link>
          </>
        )
      case 'plan':
        return (
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
              <Details
                handleHighlightBooking={() =>
                  state.handleHighlightBooking(undefined)
                }
                state={data}
              />
            </Route>
            <Route path="/add-vehicle">
              <AddVehicle onSubmit={state.addVehicle} />
            </Route>
            <Route path="/add-booking">
              <CreateBooking onSubmit={state.createBooking} />
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
