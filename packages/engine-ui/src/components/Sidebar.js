import React from 'react'
import styled from 'styled-components'
import Icon from '../assets/dashboard.svg'
import { Link } from 'react-router-dom'
import CreateBooking from './CreateBooking'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  background: white;
  width: 350px;
  z-index: 1;
  transition: transform 200ms ease;
  transform: translateX(-100%);
  padding: 2rem;
  ${({ open }) => open && 'transform: translateX(50px);'}
`

const NavStrip = styled.div`
  padding-top: 1rem;
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  background: #abd4ed;
  width: 50px;
  z-index: 2;
  display: flex;
  justify-content: center;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);

  img {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`

const BookingsContainer = styled.div`
  a:not(:first-child) {
    margin-top: 0.5rem;
  }
`

const BookingListItem = styled(Link)`
  background: #e6f5ff;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  :visited {
    color: black;
  }
  :hover {
    background: #abd4ed;
  }
`

const Sidebar = (data) => {
  const [open, setOpen] = React.useState(true)

  return (
    <>
      <NavStrip>
        <img onClick={() => setOpen((current) => !current)} src={Icon} alt="" />
      </NavStrip>
      <Container open={open}>
        <CreateBooking createBooking={data.createBooking} />
        <h3>Nuvarande bokningar</h3>
        <BookingsContainer>
          {data.bookings.map((booking) => {
            return (
              <BookingListItem
                key={booking.id}
                to={{ pathname: `/booking/${booking.id}`, state: { ok: true } }}
              >
                {booking.id}
              </BookingListItem>
            )
          })}
        </BookingsContainer>
      </Container>
    </>
  )
}

export default Sidebar
