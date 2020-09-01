import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import dispatchIcon from '../assets/dispatch.svg'
import Icons from '../assets/Icons'
import ParcelIcon from '../assets/parcel.svg'
import ShippingIcon from '../assets/shippingIcon.svg'

const NavigationBar = styled.nav`
  padding: 3rem 0;
  height: 100vh;
  background: #13c57b;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);

  img {
    width: 29px;
    height: 35px;
    cursor: pointer;
  }
`

const NavItem = styled.div`
  position: relative;
  padding: 0 1.5rem;
  margin-bottom: 5rem;

  svg {
    position: absolute;
    top: 10px;
    right: -8px;
  }
`

const Navigation: React.FC = () => {
  const location = useLocation()
  return (
    <NavigationBar>
      <NavItem>
        <Link to="/bookings">
          <img src={ParcelIcon} alt="parcel icon" />
        </Link>
        {location.pathname.search('bookings') !== -1 && <Icons.ActiveView />}
      </NavItem>
      <NavItem>
        <Link to="/transports">
          <img src={ShippingIcon} alt="shipping icon" />
        </Link>
        {location.pathname.search('transports') !== -1 && <Icons.ActiveView />}
      </NavItem>
      <NavItem>
        <Link to="/plans">
          <img src={dispatchIcon} alt="dispatch icon" />
        </Link>

        {location.pathname.search('plans') !== -1 && <Icons.ActiveView />}
      </NavItem>
    </NavigationBar>
  )
}

export default Navigation
