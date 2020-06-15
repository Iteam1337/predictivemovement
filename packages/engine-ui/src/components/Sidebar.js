import React from 'react'
import styled from 'styled-components'
import ParcelIcon from '../assets/parcel.svg'
import ShippingIcon from '../assets/shipping-fast.svg'
import Bookings from './Bookings'
import Cars from './Cars'
import CreateBooking from './CreateBooking'
import { Switch as RouterSwitch, Route, Link } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import Hooks from '../Hooks'
import CarDetails from './CarDetails'
import Filters from './Filters'
import AddVehicle from './AddVehicle'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: white;
  height: 100vh;
  display: flex;
`

const NavigationBar = styled.div`
  padding: 2rem 1rem;
  height: 100vh;
  background: #64b5f6;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);

  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-bottom: 2rem;
  }
`

const Details = ({ state }) => {
  const { data, type } = Hooks.useFilteredStateFromQueryParams(state)

  const componentFromType = () => {
    switch (type) {
      case 'booking':
        return <BookingDetails booking={data.bookings[0]} />
      case 'car':
        return <CarDetails car={data.cars[0]} />
      default:
        return null
    }
  }

  return componentFromType()
}

const Content = styled.div`
  padding: 2rem;
  width: 325px;
`

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
            <CreateBooking createBooking={state.createBooking} />
            <Filters />
            <h3>Aktuella bokningar</h3>
            <Bookings bookings={data.bookings} />
          </>
        )
      case 'cars':
        return (
          <>
            <AddVehicle addVehicle={state.addVehicle} />
            <h3>Aktuella fordon</h3>
            <Cars cars={data.cars} />
          </>
        )
      case 'dispatch':
        return <button onClick={state.dispatchOffers}>Dispatch Offers</button>
      default:
        return null
    }
  }

  return (
    <Container>
      <NavigationBar>
        <Link to="/">
          <img
            onClick={() => setNavigationCurrentView('bookings')}
            src={ParcelIcon}
            alt="parcel icon"
          />
        </Link>
        <Link to="/">
          <img
            onClick={() => setNavigationCurrentView('cars')}
            src={ShippingIcon}
            alt="shipping icon"
          />
        </Link>
        <Link>
          <img
            onClick={() => setNavigationCurrentView('dispatch')}
            alt="DISPATCH"
          />
        </Link>
      </NavigationBar>

      <Content>
        <RouterSwitch>
          <Route exact path="/">
            <>{currentViewToElement()}</>
          </Route>
          <Route path="/details">
            <Details state={data} />
          </Route>
        </RouterSwitch>
      </Content>
    </Container>
  )
}

export default Sidebar
