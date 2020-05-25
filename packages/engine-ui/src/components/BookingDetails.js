import React from 'react'

const BookingDetails = ({ booking }) => {
  if (!booking) return <p>Loading...</p>
  return <>{booking.id}</>
}

export default BookingDetails
