import React from 'react'
import styled from 'styled-components'
import Icon from '../assets/dashboard.svg'
import Bookings from './Bookings'
import CreateBooking from './CreateBooking'
import { Switch, Route, useParams } from 'react-router-dom'
import BookingDetails from './BookingDetails'

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

const Sidebar = (data) => {
  const [open, setOpen] = React.useState(true)
  const { id } = useParams()

  return (
    <>
      <NavStrip>
        <img onClick={() => setOpen((current) => !current)} src={Icon} alt="" />
      </NavStrip>
      <Container open={open}>
        {!id ? (
          <>
            <CreateBooking createBooking={data.createBooking} />
            <h3>Aktuella bokningar</h3>
            <Bookings bookings={data.bookings} />
          </>
        ) : (
          <BookingDetails booking={data.bookings.find((b) => b.id === id)} />
        )}
      </Container>
    </>
  )
}

export default Sidebar
