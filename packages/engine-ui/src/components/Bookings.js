import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

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
  color: black;
  :visited {
    color: black;
  }
  :hover {
    background: #abd4ed;
  }
`

const NoBookingsInfo = styled.p`
  font-style: italic;
  font-size: 0.875rem;
`
const Bookings = ({ bookings }) => {
  if (!bookings.length)
    return <NoBookingsInfo>Det finns inga aktuella bokningar...</NoBookingsInfo>

  return (
    <BookingsContainer>
      {bookings.map((booking) => {
        return (
          <BookingListItem
            to={{ pathname: `/details/${booking.id}` }}
            key={booking.id}
          >
            {booking.id}
          </BookingListItem>
        )
      })}
    </BookingsContainer>
  )
}

export default Bookings
