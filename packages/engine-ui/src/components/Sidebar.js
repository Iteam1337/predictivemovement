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
import Elements from './Elements'
import Filters from './Filters'

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
const useFilters = (data) => {
  // {
  //     type: 'bookings'
  //   property: 'status',
  //   value: ['assigned', new]
  // }

  const [filters, setFilters] = React.useState([])

  const temp = React.useMemo(() => {
    if (!filters.length) return data
    const filteredData = filters.map((filter) =>
      data[filter.type].filter((item) =>
        filter.value.includes(item[filter.property])
      )
    )
    console.log({ filteredData })
    return filteredData
  }, [filters, data])

  const handleSetFilters = React.useCallback((filter) => {
    setFilters((currentFilters) =>
      Object.prototype.hasOwnProperty.call(currentFilters, filter.property)
        ? currentFilters.filter((f) => f !== filter)
        : [...currentFilters, filter]
    )
  }, [])

  return [temp, handleSetFilters]
}

const Sidebar = (data) => {
  const [navigationCurrentView, setNavigationCurrentView] = React.useState(
    'bookings'
  )

  const [isChecked, setIsChecked] = React.useState(false)

  const [d, h] = useFilters(data)

  React.useEffect(() => {
    h({
      type: 'bookings',
      property: 'status',
      value: ['new'],
    })
  }, [h])

  const currentViewToElement = () => {
    switch (navigationCurrentView) {
      case 'bookings':
        return (
          <>
            <CreateBooking createBooking={data.createBooking} />
            <h3>Aktuella bokningar</h3>
            <Bookings bookings={data.bookings} />
          </>
        )
      case 'cars':
        return (
          <>
            <h3>Aktuella bilar</h3>
            <Cars cars={data.cars} />
          </>
        )
      default:
        return null
    }
  }

  const handleFilterChange = (event) => {
    event.persist()
    setIsChecked((currentValue) => !currentValue)
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
      </NavigationBar>

      <Content>
        <RouterSwitch>
          <Route exact path="/">
            <>
              <Elements.Switch
                checked={isChecked}
                onChange={handleFilterChange}
              />
              {currentViewToElement()}
            </>
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
