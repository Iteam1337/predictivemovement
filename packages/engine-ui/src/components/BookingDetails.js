import React from 'react'

import Elements from './Elements'

const BookingDetails = ({ booking }) => {
  if (!booking) return <p>Loading...</p>

  return (
    <div>
      <Elements.StrongParagraph>ID:</Elements.StrongParagraph>
      <span>{booking.id}</span>

      <Elements.StrongParagraph>Pickup:</Elements.StrongParagraph>
      <span>{booking.pickup.lat}</span>
      {', '}
      <span>{booking.pickup.lon}</span>
      <Elements.StrongParagraph>Delivery:</Elements.StrongParagraph>
      <span>{booking.delivery.lat}</span>
      <span>{booking.delivery.lon}</span>
      <Elements.StrongParagraph>Status:</Elements.StrongParagraph>
      <span>{booking.status}</span>

      {/* <Elements.StrongParagraph>Assigned to: </Elements.StrongParagraph>
      <span>{booking.assigned_to.id}</span> */}
    </div>
  )
}

export default BookingDetails
