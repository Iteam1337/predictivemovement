import React from 'react'
import Elements from '../shared-elements'
import styled from 'styled-components'
import MainRouteLayout from './layout/MainRouteLayout'
import { useParams } from 'react-router-dom'

const Paragraph = styled.p`
  margin: 0;
  margin-bottom: 2.5rem;
  text-transform: capitalize;
`

const BookingDetails = ({ bookings }) => {
  const { bookingId } = useParams()
  const booking = bookings.find((b) => b.id === bookingId)

  const [address, setAddress] = React.useState()
  const getAddressFromCoordinates = async ({ lon, lat }) => {
    return await fetch(
      `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
    )
      .then((res) => res.json())
      .then(({ features }) => features[0].properties.label)
  }

  React.useEffect(() => {
    const setAddressFromCoordinates = async (
      pickupCoordinates,
      deliveryCoordinates
    ) => {
      const pickupAddress = await getAddressFromCoordinates(pickupCoordinates)
      const deliveryAddress = await getAddressFromCoordinates(
        deliveryCoordinates
      )
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
    <MainRouteLayout>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Bokning</h3>

          <Elements.Links.RoundedLink margin="0 0.5rem">
            {booking.id}
          </Elements.Links.RoundedLink>
        </Elements.Layout.FlexRowWrapper>
        <Elements.Typography.StrongParagraph>
          Upphämtning
        </Elements.Typography.StrongParagraph>
        <Paragraph>{address.pickup}</Paragraph>
        <Elements.Typography.StrongParagraph>
          Avlämning
        </Elements.Typography.StrongParagraph>
        <Paragraph>{address.delivery}</Paragraph>
        {booking.assigned_to && (
          <>
            <Elements.Typography.StrongParagraph>
              Bokad transport
            </Elements.Typography.StrongParagraph>

            <Elements.Links.RoundedLink
              to={`/details?type=vehicle&id=${booking.assigned_to.id}`}
            >
              {booking.id}
            </Elements.Links.RoundedLink>
          </>
        )}
        <Elements.Typography.StrongParagraph>
          Status:
        </Elements.Typography.StrongParagraph>
        <span>{booking.status}</span>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default BookingDetails
