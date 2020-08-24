import React from 'react'
import styled from 'styled-components'
import ParcelIcon from '../assets/parcel.svg'
import ShippingIcon from '../assets/shippingIcon.svg'
import Bookings from './Bookings'
import Cars from './Cars'
import CreateBooking from './CreateBooking'
import CreateBookings from './CreateBookings'
import {
  Switch as RouterSwitch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom'
import BookingDetails from './BookingDetails'
import Hooks from '../hooks'
import CarDetails from './CarDetails'

import AddVehicle from './AddVehicle'
import dispatchIcon from '../assets/dispatch.svg'
import Plan from './Plan'
import Elements from './Elements'
import Icons from '../assets/Icons'
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

const NavigationBar = styled.div`
  padding: 3rem 0;
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
  }
`

const MenuItem = styled.div`
  position: relative;
  padding: 0 1.5rem;
  margin-bottom: 5rem;

  svg {
    position: absolute;
    top: 10px;
    right: -8px;
  }
`

const TextLink = styled(Link)`
  text-decoration: none;
  color: #666666;
`

const Content = styled.div`
  padding: 2rem;
  width: 325px;
`

const VerticalLine = styled.div`
  background: transparent;
  border-left: 1px solid #e5e5e5;
  height: 87vh;
  align-self: center;
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
      case 'car':
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
  const { pathname } = useLocation()
  const { data } = Hooks.useFilteredStateFromQueryParams(state)

  const currentViewToElement = () => {
    switch (navigationCurrentView) {
      case 'bookings':
        return (
          <>
            <h3>Aktuella bokningar</h3>
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
      {/* <NavigationBar>
        <MenuItem>
          <Link to="/">
            <img
              onClick={() => setNavigationCurrentView('bookings')}
              src={ParcelIcon}
              alt="parcel icon"
            />
          </Link>
          {navigationCurrentView === 'bookings' && <Icons.ActiveView />}
        </MenuItem>
        <MenuItem>
          <Link to="/">
            <img
              onClick={() => setNavigationCurrentView('cars')}
              src={ShippingIcon}
              alt="shipping icon"
            />
          </Link>
          {navigationCurrentView === 'cars' && <Icons.ActiveView />}
        </MenuItem>
        <MenuItem>
          <Link to="/">
            <img
              onClick={() => setNavigationCurrentView('plan')}
              src={dispatchIcon}
              alt="dispatch icon"
            />
          </Link>

          {navigationCurrentView === 'plan' && <Icons.ActiveView />}
        </MenuItem>
      </NavigationBar> */}

      <Content>
        <RouterSwitch>
          <Route path="/">
            <>{currentViewToElement()}</>
          </Route>
        </RouterSwitch>
      </Content>

      {pathname !== '/' && (
        <>
          <VerticalLine />
          <Content>
            <RouterSwitch>
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
        </>
      )}
    </Container>
  )
}

export default Sidebar
