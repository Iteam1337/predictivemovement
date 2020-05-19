import React from 'react'
import styled from 'styled-components'
import Icon from '../assets/dashboard.svg'
import { Link } from 'react-router-dom'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  background: #fcf7fc;
  width: 250px;
  z-index: 1;
  transition: transform 200ms ease;
  transform: translateX(-100%);
  padding: 1rem;

  ${({ open }) => open && 'transform: translateX(50px);'}
`

const NavStrip = styled.div`
  padding-top: 1rem;
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  background: dodgerblue;
  width: 50px;
  z-index: 2;
  display: flex;
  justify-content: center;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.5);

  img {
    width: 30px;
    height: 30px;
    :hover {
      cursor: pointer;
    }
  }
`

const CreateBooking = ({ createBooking }) => {
  const [formState, setState] = React.useState({
    pickup: '61.8294925,16.0565493',
    dropoff: '61.8644045,16.001133',
  })

  const create = (event) => {
    event.preventDefault()

    const pickup = formState.pickup
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)
    const dropoff = formState.dropoff
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)

    if (!pickup.length || !dropoff.length) return false
    createBooking({ pickup, dropoff })
  }
  return (
    <div>
      <h2>Skapa en ny bokning</h2>
      <form onSubmit={create}>
        <div>
          <div>
            <label>Pickup</label>
          </div>
          <input
            type="text"
            value={formState.pickup}
            onChange={(e) =>
              setState({
                pickup: e.target.value,
                dropoff: formState.dropoff,
              })
            }
          />
        </div>
        <div>
          <div>
            <label>Dropoff</label>
          </div>
          <input
            type="text"
            value={formState.dropoff}
            onChange={(e) =>
              setState({
                pickup: formState.pickup,
                dropoff: e.target.value,
              })
            }
          />
        </div>
        <div>
          <button type="submit">Skapa bokning</button>
        </div>
      </form>
    </div>
  )
}

const BookingsContainer = styled.div``
const BookingListItem = styled.div`
  background: white;
  border-radius: 10px;
  padding: 10px;
  margin-top: 1rem;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  display: inline-block;
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
        <BookingsContainer>
          <p>Nuvarande bokningar:</p>
          {data.bookings.map((booking) => {
            return (
              <StyledLink
                key={booking.id}
                to={{ pathname: `/booking/${booking.id}`, state: { ok: true } }}
              >
                <BookingListItem>{booking.id}</BookingListItem>
              </StyledLink>
            )
          })}
        </BookingsContainer>
      </Container>
    </>
  )
}

export default Sidebar
