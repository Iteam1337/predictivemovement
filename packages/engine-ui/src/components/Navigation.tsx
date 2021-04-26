import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import DispatchIcon from '../assets/dispatch.svg'
import * as Icons from '../assets/Icons'
import ParcelIcon from '../assets/parcel.svg'
import ShippingIcon from '../assets/shippingIcon.svg'
import Hamburger from '../assets/hamburger.svg'

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

const MobileMenu = styled(NavigationBar)`
  position: absolute;
  width: 100vw;
  z-index: 10;
  align-items: flex-end;
`

const NavList = styled.div`
  padding: 5rem 1rem;
  width: 100%;

  div {
    display: flex;
    align-items: flex-start;
  }
`

const MobileNavItem = styled(NavItem)`
  margin-bottom: 4rem;
`

const LinkText = styled(Link)`
  text-decoration: none;
  margin-left: 1rem;

  h4 {
    margin: 0;
    cursor: default;
    color: white;
    font-size: 1.6rem;
  }
`
const HamburgerWrapper = styled.div`
  background-color: #13c57b;
  padding: 1.5rem;
  border-radius: 50%;
  z-index: 20;
  position: absolute;
  right: 0;
  margin: 1.5rem 1.5rem;
  button {
    border: none;
    background: none;
    padding: 0;
  }
`
const navItems = [
  {
    path: 'bookings',
    title: 'Bokningar',
    icon: {
      src: ParcelIcon,
      alt: 'parcel icon',
    },
  },
  {
    path: 'transports',
    title: 'Transporter',
    icon: {
      src: ShippingIcon,
      alt: 'shipping icon',
    },
  },
  {
    path: 'plans',
    title: 'Planer',
    icon: {
      src: DispatchIcon,
      alt: 'dispatch icon',
    },
  },
]

const HamburgerMenu = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <HamburgerWrapper>
        <button onClick={() => setOpen(!open)}>
          <img src={Hamburger} alt="menu" />
        </button>
      </HamburgerWrapper>
      {open && (
        <MobileMenu>
          <NavList>
            {navItems.map((navItem, i) => (
              <MobileNavItem key={i}>
                <div>
                  <Link to={`/${navItem.path}`} onClick={() => setOpen(false)}>
                    <img src={navItem.icon.src} alt={navItem.icon.alt} />
                  </Link>
                  <LinkText
                    to={`/${navItem.path}`}
                    onClick={() => setOpen(false)}
                  >
                    <h4>{navItem.title}</h4>
                  </LinkText>
                </div>
              </MobileNavItem>
            ))}
          </NavList>
        </MobileMenu>
      )}
    </>
  )
}

const Navigation: React.FC = () => {
  const location = useLocation()
  const isMobile = window.innerWidth <= 645
  return isMobile ? (
    <HamburgerMenu />
  ) : (
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
