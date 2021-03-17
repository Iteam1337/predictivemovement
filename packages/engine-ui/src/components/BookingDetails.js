import React from 'react'
import * as Elements from '../shared-elements'
import styled from 'styled-components'
import MainRouteLayout from './layout/MainRouteLayout'
import { useParams, useHistory } from 'react-router-dom'
import * as helpers from '../utils/helpers'
import moment from 'moment'
import ContactPhone from '../assets/contact-phone.svg'
import ContactName from '../assets/contact-name.svg'
import * as stores from '../utils/state/stores'
import DeliveryDetails from './DeliveryDetails'

const BorderContainer = styled.div`
  padding-right: ${(props) => (props.visible ? '0.5rem' : null)};
  border-right: ${(props) => (props.visible ? '1px solid #e5e5e5' : null)};
  width: ${(props) => (props.visible ? '300px' : '100%')}; ;
`

const Paragraph = styled.p`
  margin-bottom: 0.25rem;
  margin-top: 0;
`
const CapitalizeParagraph = styled(Paragraph)`
  text-transform: capitalize;
`
const ExpectedEventWrapper = styled.div`
  margin-left: 3.5rem;
`

const ExpectedEventParagraph = styled.p`
  margin: 0;
  color: rgb(0, 0, 0, 0.3);
`

const Line = styled.div`
  width: 1px;
  border-left: 2px solid ${(props) => (props.status ? '#19de8b' : '#a8a8a8')};
  position: absolute;
  height: 90%;
  margin-left: -0.68rem;
  top: -1.5rem;
`

const TimelineListItem = styled.li`
  position: relative;
  margin: 0;
  padding-bottom: 1em;
  padding-left: 1em;
  display: flex;
  align-items: flex-end;

  :before {
    content: '';
    background-color: ${(props) =>
      props.error ? 'red' : props.status ? '#19de8b' : '#a8a8a8'};
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 3px;
    height: 12px;
    width: 12px;
    z-index: 2;
  }

  :last-child:after {
    content: '';
    width: 0;
  }
`

const Timeline = styled.div`
  margin-top: 1.5rem;
  ol {
    list-style-type: none;
    padding: 0;
  }
  img {
    padding-right: 0.5rem;
  }

  & ${TimelineListItem}:nth-child(1) ${Line} {
    display: none;
  }
`
const timeWindowToElement = ({ earliest, latest }) => {
  const formatDateLong = (date) => moment(date).format('YYYY-MM-DD, HH:mm')
  const formatDateShort = (date) => moment(date).format('HH:mm')

  const isSameDay = moment(earliest).isSame(latest, 'day')

  return (
    <Elements.Typography.SmallInfoBold key={earliest}>
      {`${formatDateLong(earliest)} - ${
        isSameDay ? formatDateShort(latest) : formatDateLong(latest)
      }`}
    </Elements.Typography.SmallInfoBold>
  )
}

const BookingDetails = ({ bookings, deleteBooking, onUnmount, onMount }) => {
  const { bookingId } = useParams()
  const history = useHistory()
  const booking = bookings.find((b) => b.id === bookingId)
  const [address, setAddress] = React.useState()
  const setMapLayers = stores.mapLayerState((state) => state.set)
  const statebookings = stores.dataState((state) => state.bookings)

  React.useEffect(() => {
    onMount()
  }, [onMount])

  React.useEffect(() => {
    return () => onUnmount()
  }, [onUnmount])

  React.useEffect(() => {
    if (!booking) return

    setMapLayers({ type: 'bookingDetails', payload: { bookingId } })
  }, [setMapLayers, statebookings, booking, bookingId])

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

  const handleChangeClick = (bookingId) => {
    history.push(`/bookings/edit-booking/${bookingId}`)
  }

  const parseEventTypeToHumanReadable = (type) => {
    switch (type) {
      case 'new':
        return 'Registrerad'
      case 'picked_up':
        return 'Upphämtad'
      case 'delivered':
        return 'Levererad'
      case 'delivery_failed':
        return 'Kunde ej levereras'
      case 'assigned':
        return 'Tilldelad förare'
      default:
        return `Okänd status: "${type}"`
    }
  }

  if (!bookings.length) {
    return <p>Laddar...</p>
  }

  if (!booking)
    return (
      <p>
        Kunde inte hitta bokning med id: <b>{bookingId}</b>
      </p>
    )

  if (!address) return <p>Laddar bokning...</p>

  const {
    events,
    pickup,
    delivery,
    id,
    metadata: { cargo, fragile, sender, recipient },
    size: { measurements, weight },
  } = booking

  const expectedEvents = ['new', 'assigned', 'picked_up', 'delivered']

  const bookingEvents = events.map((event) => event.type)

  const eventsList = events
    .sort((a, b) => (new Date(a.timestamp) > new Date(b.timestamp) ? 1 : -1))
    .concat(
      expectedEvents.filter((event) => {
        return !bookingEvents.includes(event)
      })
    )
  return (
    <MainRouteLayout redirect="/bookings">
      <Elements.Layout.Container>
        <Elements.Layout.FlexContainer>
          <div style={{ width: '300px' }}>
            <Elements.Layout.FlexRowWrapper>
              <h3>Bokning</h3>
              <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
                {helpers.getLastFourChars(booking.id).toUpperCase()}
              </Elements.Typography.RoundedLabelDisplay>
            </Elements.Layout.FlexRowWrapper>
            <BorderContainer visible={booking.status === 'delivered'}>
              <Elements.Layout.SectionWithMargin>
                {cargo && (
                  <CapitalizeParagraph>
                    <Elements.Typography.SpanBold>
                      Innehåll:{' '}
                    </Elements.Typography.SpanBold>
                    {cargo}
                  </CapitalizeParagraph>
                )}
                <Paragraph>
                  <Elements.Typography.SpanBold>
                    Ömtåligt:{' '}
                  </Elements.Typography.SpanBold>
                  {fragile ? 'Ja' : 'Nej'}
                </Paragraph>
                {measurements && (
                  <Paragraph>
                    <Elements.Typography.SpanBold>
                      Mått:{' '}
                    </Elements.Typography.SpanBold>
                    {measurements.map((item, index) =>
                      measurements.length === index + 1
                        ? `${item} cm `
                        : `${item}x`
                    )}
                  </Paragraph>
                )}
                {weight && (
                  <Paragraph>
                    <Elements.Typography.SpanBold>
                      Vikt:{' '}
                    </Elements.Typography.SpanBold>
                    {`${weight} kg`}
                  </Paragraph>
                )}
              </Elements.Layout.SectionWithMargin>
              <Elements.Layout.SectionWithMargin>
                <Elements.Layout.MarginBottomContainer>
                  <Elements.Typography.StrongParagraph>
                    Upphämtning
                  </Elements.Typography.StrongParagraph>
                  <CapitalizeParagraph>{address.pickup}</CapitalizeParagraph>
                  {pickup.timeWindows &&
                    pickup.timeWindows.map(timeWindowToElement)}
                </Elements.Layout.MarginBottomContainer>
                {sender.name && (
                  <Elements.Layout.FlexRowBaselineContainer>
                    <Elements.Icons.MarginRightIcon
                      src={ContactName}
                      alt="Contact Avatar"
                    />
                    <CapitalizeParagraph>{sender.name}</CapitalizeParagraph>
                  </Elements.Layout.FlexRowBaselineContainer>
                )}
                <Elements.Layout.FlexRowBaselineContainer>
                  <Elements.Icons.MarginRightIcon
                    src={ContactPhone}
                    alt="Contact Phone"
                  />
                  <Paragraph>{sender.contact}</Paragraph>
                </Elements.Layout.FlexRowBaselineContainer>
              </Elements.Layout.SectionWithMargin>
              <Elements.Layout.SectionWithMargin>
                <Elements.Layout.MarginBottomContainer>
                  <Elements.Typography.StrongParagraph>
                    Avlämning
                  </Elements.Typography.StrongParagraph>
                  <CapitalizeParagraph>{address.delivery}</CapitalizeParagraph>
                  {delivery.timeWindows &&
                    delivery.timeWindows.map(timeWindowToElement)}
                </Elements.Layout.MarginBottomContainer>
                {sender.name && (
                  <Elements.Layout.FlexRowBaselineContainer>
                    <Elements.Icons.MarginRightIcon
                      src={ContactName}
                      alt="Contact Avatar"
                    />
                    <CapitalizeParagraph>{recipient.name}</CapitalizeParagraph>
                  </Elements.Layout.FlexRowBaselineContainer>
                )}
                <Elements.Layout.FlexRowBaselineContainer>
                  <Elements.Icons.MarginRightIcon
                    src={ContactPhone}
                    alt="Contact Phone"
                  />
                  <Paragraph>{recipient.contact}</Paragraph>
                </Elements.Layout.FlexRowBaselineContainer>
              </Elements.Layout.SectionWithMargin>
              <Elements.Layout.MarginTopContainer>
                {booking.assigned_to && (
                  <>
                    <Elements.Typography.StrongParagraph>
                      Bokad transport
                    </Elements.Typography.StrongParagraph>

                    <Elements.Links.RoundedLink
                      to={`/transports/${booking.assigned_to.id}`}
                    >
                      {helpers
                        .getLastFourChars(booking.assigned_to.id)
                        .toUpperCase()}
                    </Elements.Links.RoundedLink>
                  </>
                )}
              </Elements.Layout.MarginTopContainer>
              <Timeline>
                <Elements.Typography.StrongParagraph>
                  Status
                </Elements.Typography.StrongParagraph>
                {booking.events.length ? (
                  <ol>
                    {eventsList.map((event, index) => {
                      return (
                        <TimelineListItem
                          key={index}
                          status={event.type ? true : false}
                          error={event.type === 'delivery_failed'}
                        >
                          <Line status={event.type ? true : false} />
                          {event.type ? (
                            <>
                              <Elements.Typography.NoMarginParagraph>
                                {moment(event.timestamp).format('HH:mm')}
                              </Elements.Typography.NoMarginParagraph>
                              <Elements.Layout.MarginLeftContainerSm>
                                <Elements.Typography.NoMarginParagraph>
                                  {parseEventTypeToHumanReadable(event.type)}
                                </Elements.Typography.NoMarginParagraph>
                              </Elements.Layout.MarginLeftContainerSm>
                            </>
                          ) : (
                            <ExpectedEventWrapper>
                              <ExpectedEventParagraph>
                                {parseEventTypeToHumanReadable(event)}
                              </ExpectedEventParagraph>
                            </ExpectedEventWrapper>
                          )}
                        </TimelineListItem>
                      )
                    })}
                  </ol>
                ) : (
                  <CapitalizeParagraph>{booking.status} </CapitalizeParagraph>
                )}
              </Timeline>

              {booking.status === 'new' && (
                <Elements.Layout.MarginTopContainer alignItems="center">
                  <Elements.Layout.ButtonWrapper>
                    <Elements.Buttons.SubmitButton
                      type="button"
                      onClick={() => handleChangeClick(id)}
                    >
                      Ändra bokning
                    </Elements.Buttons.SubmitButton>
                  </Elements.Layout.ButtonWrapper>
                  <Elements.Layout.ButtonWrapper>
                    <Elements.Buttons.CancelButton
                      onClick={() => handleDeleteClick(id)}
                    >
                      Radera bokning
                    </Elements.Buttons.CancelButton>
                  </Elements.Layout.ButtonWrapper>
                </Elements.Layout.MarginTopContainer>
              )}
            </BorderContainer>
          </div>
          <div>
            {booking.status === 'delivered' && (
              <DeliveryDetails
                distance={booking.route.distance}
                duration={booking.route.duration}
                bookingId={bookingId}
                assignedTo={booking.assignedTo.id}
              />
            )}
          </div>
        </Elements.Layout.FlexContainer>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default BookingDetails
