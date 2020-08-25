import React from 'react'
import Elements from '../shared-elements'
import styled from 'styled-components'
import NestedMenu from './layout/NestedMenu'
import helpers from '../utils/helpers'

const Paragraph = styled.p`
  margin: 0;
  margin-bottom: 2.5rem;
  text-transform: capitalize;
`

const BookingDetails = ({ booking, handleHighlightBooking }) => {
  const [address, setAddress] = React.useState()

  React.useEffect(() => {
    const setAddressFromCoordinates = async (
      pickupCoordinates,
      deliveryCoordinates
    ) => {
      const pickupAddress = await helpers.getAddressFromCoordinate(
        pickupCoordinates
      )

      const deliveryAddress = await helpers.getAddressFromCoordinate(
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

  if (!booking || !address) return <p>Laddar bokning...</p>

  return (
    <NestedMenu onClickHandler={handleHighlightBooking}>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Bokning</h3>

          <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
            {booking.id}
          </Elements.Typography.RoundedLabelDisplay>
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
    </NestedMenu>
  )
}

export default BookingDetails
