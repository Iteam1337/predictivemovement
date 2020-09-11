import React from 'react'
import Elements from '../shared-elements'
import styled from 'styled-components'
import Dot from '../assets/dot.svg'
import MainRouteLayout from './layout/MainRouteLayout'
import { useParams, useHistory } from 'react-router-dom'
import helpers from '../utils/helpers'

const Paragraph = styled.p`
  margin: 0;
  margin-bottom: 2.5rem;
  text-transform: capitalize;
`

const Timeline = styled.div`
  ol {
    list-style-type: none;
    padding: 0;
  }

  li {
    position: relative;
    margin: 0;
    padding-bottom: 1em;
    padding-left: 1em;
    display: flex;
    align-items: center;
  }

  img {
    padding-right: 0.5rem;
  }

  li:after {
    content: '';
    background-color: #19de8b;
    position: absolute;
    bottom: 0;
    top: 1px;
    left: 0.3rem;
    width: 2px;
  }

  li:before {
    content: '';
    background-image: url(${Dot});
    position: absolute;
    left: 0;
    top: 0;
    height: 12px;
    width: 12px;
  }

  li:last-child:after {
    content: '';
    width: 0;
  }

  div {
    justify-content: space-between;
    width: 70%;
    margin-top: -2px;
  }
`

const statuses = ['new', 'assigned', 'picked up', 'deliverd']
const BookingDetails = ({ bookings, onClickHandler, deleteBooking }) => {
  const { bookingId } = useParams()
  const history = useHistory()

  const booking = bookings.find((b) => b.id === bookingId)
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

  const handleDeleteClick = (bookingId) => {
    if (window.confirm('Är du säker på att du vill radera bokningen?')) {
      deleteBooking(bookingId)
      return history.push('/bookings')
    }
  }

  if (!booking || !address) return <p>Laddar bokning...</p>

  return (
    <MainRouteLayout redirect="/bookings" onClickHandler={onClickHandler}>
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
              to={`/transports/${booking.assigned_to.id}`}
            >
              {booking.id}
            </Elements.Links.RoundedLink>
          </>
        )}
        <Elements.StrongParagraph>Status:</Elements.StrongParagraph>
        <Timeline>
          <ol>
            {statuses.map((status, index) => (
              <li key={index}>
                <Elements.FlexRowWrapper>
                  <Elements.NoMarginParagraph>15.17</Elements.NoMarginParagraph>
                  <Elements.NoMarginParagraph>
                    {status}
                  </Elements.NoMarginParagraph>
                </Elements.FlexRowWrapper>
              </li>
            ))}
          </ol>
        </Timeline>
        <span>{booking.status}</span>
        <Elements.Layout.MarginTopContainer>
          <Elements.Buttons.DeleteButton
            onClick={() => handleDeleteClick(booking.id)}
          >
            Radera bokning
          </Elements.Buttons.DeleteButton>
        </Elements.Layout.MarginTopContainer>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default BookingDetails
