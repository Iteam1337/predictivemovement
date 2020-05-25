import React from 'react'

import Elements from './Elements'

const BookingDetails = ({ booking }) => {
  if (!booking) return <p>Loading...</p>
  console.log('booking', booking.assigned_to)
  return (
    <div>
      <Elements.StrongParagraph>ID:</Elements.StrongParagraph>
      <span>{booking.id}</span>

      <Elements.StrongParagraph>Departure:</Elements.StrongParagraph>
      <span>{booking.departure.lat}</span>
      {', '}
      <span>{booking.departure.lon}</span>
      <Elements.StrongParagraph>Destination:</Elements.StrongParagraph>
      <span>{booking.destination.lat}</span>
      <span>{booking.destination.lon}</span>
      <Elements.StrongParagraph>Status:</Elements.StrongParagraph>
      <span>{booking.status}</span>

      <Elements.StrongParagraph>Assigned to: </Elements.StrongParagraph>
      <span>{booking.assigned_to.id}</span>
    </div>
  )
}

export default BookingDetails
