import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import DispatchIcon from '../assets/dispatch.svg'
import * as Icons from '../assets/Icons'
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

const navItems = [
  {
    path: 'bookings',
    icon: {
      src: ParcelIcon,
      alt: 'parcel icon',
    },
  },
  {
    path: 'transports',
    icon: {
      src: ShippingIcon,
      alt: 'shipping icon',
    },
  },
  {
    path: 'plans',
    icon: {
      src: DispatchIcon,
      alt: 'dispatch icon',
    },
  },
]

const Navigation: React.FC = () => {
  const location = useLocation()
  return (
    <NavigationBar>
      {navItems.map((navItem, i) => (
        <NavItem key={i}>
          <Link to={`/${navItem.path}`}>
            <img src={navItem.icon.src} alt={navItem.icon.alt} />
          </Link>
          {location.pathname.search(navItem.path) !== -1 && (
            <Icons.ActiveView />
          )}
        </NavItem>
      ))}
    </NavigationBar>
  )
}

export default Navigation
