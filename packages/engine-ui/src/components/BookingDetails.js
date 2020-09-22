import React from 'react'
import Elements from '../shared-elements'
import styled from 'styled-components'
import Dot from '../assets/dot.svg'
import MainRouteLayout from './layout/MainRouteLayout'
import { useParams, useHistory } from 'react-router-dom'
import helpers from '../utils/helpers'
import moment from 'moment'

const Paragraph = styled.p`
  margin-bottom: 0.25rem;
  margin-top: 0;
  text-transform: capitalize;
`

const Timeline = styled.div`
  margin-top: 2.5rem;

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
    align-items: flex-end;
  }

  img {
    padding-right: 0.5rem;
  }

  li:after {
    content: '';
    background-color: #19de8b;
    position: absolute;
    bottom: -4px;
    top: 4px;
    left: 0.3rem;
    width: 2px;
  }

  li:before {
    content: '';
    background-image: url(${Dot});
    position: absolute;
    left: 0;
    top: 3px;
    height: 12px;
    width: 12px;
  }

  li:last-child:after {
    content: '';
    width: 0;
  }
`

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
        pickup: `${pickupAddress.name}, ${pickupAddress.county}`,
        delivery: `${deliveryAddress.name}, ${deliveryAddress.county}`,
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

  const parseEventTypeToHumanReadable = (type) => {
    switch (type) {
      case 'new':
        return 'Registrerad'
      case 'picked_up':
        return 'Upphämtad'
      case 'delivered':
        return 'Levererad'
      case 'assigned':
        return 'Tilldelad förare'
      default:
        return 'Ingen status hittades'
    }
  }

  if (!booking || !address) return <p>Laddar bokning...</p>

  const { pickup, delivery, id } = booking

  return (
    <MainRouteLayout redirect="/bookings" onClickHandler={onClickHandler}>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Bokning</h3>
          <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
            {id}
          </Elements.Typography.RoundedLabelDisplay>
        </Elements.Layout.FlexRowWrapper>
        <Elements.Layout.MarginBottomContainer />
        <Elements.Typography.StrongParagraph>
          Upphämtning
        </Elements.Typography.StrongParagraph>
        <Paragraph>{address.pickup}</Paragraph>
        {pickup.time_windows &&
          pickup.time_windows.map((timeWindow) => (
            <Elements.Typography.SmallInfoBold key={timeWindow.earliest}>
              {moment(timeWindow.earliest).format('YYYY-MM-DD, hh:mm')} -{' '}
              {moment(timeWindow.latest).format('YYYY-MM-DD, hh:mm')}
            </Elements.Typography.SmallInfoBold>
          ))}
        <Elements.Layout.MarginBottomContainer />
        <Elements.Typography.StrongParagraph>
          Avlämning
        </Elements.Typography.StrongParagraph>
        <Paragraph>{address.delivery}</Paragraph>

        {delivery.time_windows &&
          delivery.time_windows.map((timeWindow) => (
            <Elements.Typography.SmallInfoBold key={timeWindow.earliest}>
              {moment(timeWindow.earliest).format('YYYY-MM-DD, hh:mm')} -{' '}
              {moment(timeWindow.latest).format('YYYY-MM-DD, hh:mm')}
            </Elements.Typography.SmallInfoBold>
          ))}

        {booking.assigned_to && (
          <>
            <Elements.Typography.StrongParagraph>
              Bokad transport
            </Elements.Typography.StrongParagraph>

            <Elements.Links.RoundedLink
              to={`/transports/${booking.assigned_to.id}`}
            >
              {booking.assigned_to.id}
            </Elements.Links.RoundedLink>
          </>
        )}
        <Timeline>
          <Elements.Typography.StrongParagraph>
            Status
          </Elements.Typography.StrongParagraph>
          {booking.events.length ? (
            <ol>
              {booking.events.map((event, index) => (
                <li key={index}>
                  <Elements.Typography.NoMarginParagraph>
                    {moment(event.timestamp).format('HH:mm')}
                  </Elements.Typography.NoMarginParagraph>
                  <Elements.Layout.MarginLeftContainerSm>
                    <Elements.Typography.NoMarginParagraph>
                      {parseEventTypeToHumanReadable(event.type)}
                    </Elements.Typography.NoMarginParagraph>
                  </Elements.Layout.MarginLeftContainerSm>
                </li>
              ))}
            </ol>
          ) : (
            <Paragraph>{booking.status}</Paragraph>
          )}
        </Timeline>
        <Elements.Layout.MarginTopContainer>
          <Elements.Buttons.DeleteButton onClick={() => handleDeleteClick(id)}>
            Radera bokning
          </Elements.Buttons.DeleteButton>
        </Elements.Layout.MarginTopContainer>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default BookingDetails
