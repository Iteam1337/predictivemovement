import React from 'react'
import { Link } from 'react-router-dom'
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
    width: 30px;
    height: 30px;
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

interface INavProps {
  navigationCurrentView: string
  setNavigationCurrentView: (arg: string) => void
}

const Navigation: React.FC<INavProps> = ({
  navigationCurrentView,
  setNavigationCurrentView,
}) => {
  const handleOnClickNavIcon = (selectedView: string) => {
    if (selectedView === navigationCurrentView) {
      setNavigationCurrentView('')
    } else {
      setNavigationCurrentView(selectedView)
    }
  }
  return (
    <NavigationBar>
      <NavItem>
        <Link to="/" onClick={() => handleOnClickNavIcon('bookings')}>
          <img src={ParcelIcon} alt="parcel icon" />
        </Link>
        {navigationCurrentView === 'bookings' && <Icons.ActiveView />}
      </NavItem>
      <NavItem>
        <Link to="/" onClick={() => handleOnClickNavIcon('cars')}>
          <img src={ShippingIcon} alt="shipping icon" />
        </Link>
        {navigationCurrentView === 'cars' && <Icons.ActiveView />}
      </NavItem>
      <NavItem>
        <Link to="/" onClick={() => handleOnClickNavIcon('plan')}>
          <img src={dispatchIcon} alt="dispatch icon" />
        </Link>

        {navigationCurrentView === 'plan' && <Icons.ActiveView />}
      </NavItem>
    </NavigationBar>
  )
}

export default Navigation
