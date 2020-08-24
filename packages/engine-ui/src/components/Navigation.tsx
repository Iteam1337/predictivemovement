import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ParcelIcon from '../assets/parcel.svg'
import ShippingIcon from '../assets/shippingIcon.svg'
import dispatchIcon from '../assets/dispatch.svg'
import Elements from './Elements'
import Icons from '../assets/Icons'
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
  return (
    <NavigationBar>
      <NavItem>
        <Link to="/">
          <img
            onClick={() => setNavigationCurrentView('bookings')}
            src={ParcelIcon}
            alt="parcel icon"
          />
        </Link>
        {navigationCurrentView === 'bookings' && <Icons.ActiveView />}
      </NavItem>
      <NavItem>
        <Link to="/">
          <img
            onClick={() => setNavigationCurrentView('cars')}
            src={ShippingIcon}
            alt="shipping icon"
          />
        </Link>
        {navigationCurrentView === 'cars' && <Icons.ActiveView />}
      </NavItem>
      <NavItem>
        <Link to="/">
          <img
            onClick={() => setNavigationCurrentView('plan')}
            src={dispatchIcon}
            alt="dispatch icon"
          />
        </Link>

        {navigationCurrentView === 'plan' && <Icons.ActiveView />}
      </NavItem>
    </NavigationBar>
  )
}

export default Navigation
