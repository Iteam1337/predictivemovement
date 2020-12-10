import React from 'react'
import styled from 'styled-components'
import Bookings from './Bookings'
import { Switch as RouterSwitch, Route, Redirect } from 'react-router-dom'
import Plan from './Plan'
import Navigation from './Navigation'
import Transports from './Transports'
import NotFound from './NotFound'
import { Booking, Plan as IPlan, Transport } from '../types'

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
  bookings: Booking[]
  plan: IPlan
  transports: Transport[]
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
      <RouterSwitch>
        <Route exact path="/">
          <Redirect from="/" to="/bookings" />
        </Route>
        <Route>
          <Content isMobile={state.isMobile}>
            <RouterSwitch>
              <Route path="/bookings">
                <Bookings
                  bookings={state.bookings}
                  createBooking={state.createBooking}
                  deleteBooking={state.deleteBooking}
                  updateBooking={state.updateBooking}
                />
              </Route>
              <Route path="/transports">
                <Transports
                  transports={state.transports}
                  createTransport={state.createTransport}
                  deleteTransport={state.deleteTransport}
                />
              </Route>
              <Route path="/plans">
                <Plan
                  plan={state.plan}
                  dispatchOffers={state.dispatchOffers}
                  transports={state.transports}
                  bookings={state.bookings}
                  moveBooking={state.moveBooking}
                />
              </Route>
              <Route component={NotFound} />
            </RouterSwitch>
          </Content>
        </Route>
      </RouterSwitch>
    </Container>
  )
}

export default Sidebar
