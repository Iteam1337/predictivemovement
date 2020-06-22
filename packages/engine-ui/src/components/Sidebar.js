import React from 'react'
import styled from 'styled-components'
import ParcelIcon from '../assets/parcel.svg'
import ShippingIcon from '../assets/shippingIcon.svg'
import Bookings from './Bookings'
import Cars from './Cars'
import CreateBooking from './CreateBooking'
import { Switch as RouterSwitch, Route, Link } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import Hooks from '../Hooks'
import CarDetails from './CarDetails'
import Filters from './Filters'
import AddVehicle from './AddVehicle'
import Dispatch from '../assets/dispatch.svg'

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
  padding: 3rem 1rem;
  height: 100vh;
  background: #13c57b;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);

  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-bottom: 5rem;
  }
`

const TextLink = styled(Link)`
  text-decoration: none;
  color: #666666;
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
            <Filters />
            <h3>Aktuella bokningar</h3>
            <Bookings bookings={data.bookings} />
            <TextLink to="/addBooking">
              <h3>+ Lägg till bokning</h3>
            </TextLink>
          </>
        )
      case 'cars':
        return (
          <>
            <h3>Aktuella fordon</h3>
            <Cars cars={data.cars} />
            <TextLink to="/addVehicle">
              <h3>+ Lägg till bil</h3>
            </TextLink>
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
        <Link to="/">
          <img
            onClick={() => setNavigationCurrentView('dispatch')}
            src={Dispatch}
            alt="Dispatch icon"
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
          <Route path="/addVehicle">
            <AddVehicle
              currentPosition={state.currentPosition}
              addVehicle={state.addVehicle}
            />
          </Route>
          <Route path="/addBooking">
            <CreateBooking createBooking={state.createBooking} />
          </Route>
        </RouterSwitch>
      </Content>
    </Container>
  )
}

export default Sidebar
