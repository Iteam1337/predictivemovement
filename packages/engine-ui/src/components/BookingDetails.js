import React from 'react'

import Elements from './Elements'
import styled from 'styled-components'

const Paragraph = styled.p`
  margin: 0;
  margin-bottom: 2.5rem;
  text-transform: capitalize;
`
const BookingDetails = ({ booking }) => {
  const [address, setAddress] = React.useState()

  const getAddressFromCoordinates = async ({ lon, lat }) => {
    return await fetch(
      `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
    )
      .then((res) => res.json())
      .then(({ features }) => features[0].properties.label)
  }

  const setAddress = async ({ pickup, delivery }) => {
    const pickupAddress = await getAddressFromCoordinates(pickup)
    const deliveryAddress = await getAddressFromCoordinates(delivery)
    setAddress({
      pickup: pickupAddress,
      delivery: deliveryAddress,
    })
  }

  React.useEffect(() => {
    if (!booking) return
    setAddress(booking)
  }, [booking])

  if (!booking || !address) return <p>Loading...</p>

  return (
    <div>
      <Elements.StrongParagraph>Bokning</Elements.StrongParagraph>
      <Paragraph>{booking.id}</Paragraph>

      <Elements.StrongParagraph>Upphämtning</Elements.StrongParagraph>
      <Paragraph>{address.pickup}</Paragraph>
      <Elements.StrongParagraph>Avlämning</Elements.StrongParagraph>
      <Paragraph>{address.delivery}</Paragraph>
      <Elements.StrongParagraph>Status:</Elements.StrongParagraph>
      <span>{booking.status}</span>

      {/* <Elements.StrongParagraph>Assigned to: </Elements.StrongParagraph>
      <span>{booking.assigned_to.id}</span> */}
    </div>
  )
}

export default BookingDetails
