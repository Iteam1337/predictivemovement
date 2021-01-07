import React from 'react'
import styled from 'styled-components'
import Bookings from './Bookings'
import { Route, Redirect } from 'react-router-dom'
import Plan from './Plan'
import Navigation from './Navigation'
import Transports from './Transports'
import NotFound from './NotFound'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: white;
  height: 100vh;
  display: flex;
`

const Content = styled.div<{ isMobile: Boolean }>`
  padding: 2rem;
  width: ${({ isMobile }) => (isMobile ? '100%' : '400px')};
  overflow: auto;
`

interface Props {
  isMobile: Boolean
  createBooking: (params: any) => void
  updateBooking: (params: any) => void
  deleteBooking: (params: any) => void
  dispatchOffers: (params: any) => void
  createTransport: (params: any) => void
  deleteTransport: (id: string) => void
  moveBooking: (bookingId: string, transportId: string) => void
}

const Sidebar = (state: Props) => {
  return (
    <Container>
      <Navigation />
      <Route exact path="/">
        <Redirect from="/" to="/bookings" />
      </Route>
      <Content isMobile={state.isMobile}>
        <Route path="/bookings">
          <Bookings
            createBooking={state.createBooking}
            deleteBooking={state.deleteBooking}
            updateBooking={state.updateBooking}
          />
        </Route>
        <Route path="/transports">
          <Transports
            createTransport={state.createTransport}
            deleteTransport={state.deleteTransport}
          />
        </Route>
        <Route path="/plans">
          <Plan
            dispatchOffers={state.dispatchOffers}
            moveBooking={state.moveBooking}
          />
        </Route>
        <Route component={NotFound} />
      </Content>
    </Container>
  )
}

export default Sidebar
