import React from 'react'

import Elements from './Elements'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

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

  
  React.useEffect(() => {
    const setAddressFromCoordinates = async (pickupCoordinates, deliveryCoordinates ) => {
      const pickupAddress = await getAddressFromCoordinates(pickupCoordinates)
      const deliveryAddress = await getAddressFromCoordinates(deliveryCoordinates)
      setAddress({
        pickup: pickupAddress,
        delivery: deliveryAddress,
      })
    }
    
    if (!booking) return
    setAddressFromCoordinates(booking.pickup, booking.delivery)
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
      {booking.assigned_to && (
        <>
          <Elements.StrongParagraph>Bokad transport</Elements.StrongParagraph>

          <Elements.RoundedLink to={`/details?type=car&id=${booking.assigned_to.id}`}>
            {booking.id}
          </Elements.RoundedLink>
        </>
      )}
      <Elements.StrongParagraph>Status:</Elements.StrongParagraph>
      <span>{booking.status}</span>

      {/* <Elements.StrongParagraph>Assigned to: </Elements.StrongParagraph>
      <span>{booking.assigned_to.id}</span> */}
    </div>
  )
}

export default BookingDetails
