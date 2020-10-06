import React from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import Elements from '../shared-elements'
import helpers from '../utils/helpers'
import { Booking } from '../types'
import MainRouteLayout from './layout/MainRouteLayout'
import ContactPhone from '../assets/contact-phone.svg'
import ContactName from '../assets/contact-name.svg'
import moment from 'moment'
import { UIStateContext } from '../utils/UIStateContext'

interface Props {
  bookings: Booking[]
}

const Paragraph = styled.p`
  margin-bottom: 0.25rem;
  margin-top: 0;
`

const CapitalizeParagraph = styled(Paragraph)`
  text-transform: capitalize;
`

const PlanBookingDetails = ({ bookings }: Props) => {
  const { dispatch } = React.useContext(UIStateContext)
  const history = useHistory()
  const { routeId, bookingId } = useParams<{
    routeId: string
    bookingId: string
  }>()

  React.useEffect(
    () => () => {
      dispatch({ type: 'highlightBooking', payload: undefined })
    },
    [dispatch]
  )

  const [booking] = bookings.filter((d) => d.id === bookingId)

  const handleDeleteClick = (_bookingId: string) => {
    if (
      window.confirm(
        'Är du säker på att du vill ta bort bokningen från den föreslagna planen?'
      )
    ) {
      //function for removing a booking from a plan goes here.
      return history.push(`/plans/routes/${routeId}`)
    }
  }

  if (!booking || !bookings) return <p>Laddar bokning...</p>

  return (
    <MainRouteLayout redirect={`/plans/routes/${routeId}`}>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Bokning</h3>
          <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
            {helpers.withoutLastFourChars(bookingId)}
            <Elements.Typography.SpanBold>
              {helpers.getLastFourChars(bookingId)}
            </Elements.Typography.SpanBold>
          </Elements.Typography.RoundedLabelDisplay>
        </Elements.Layout.FlexRowWrapper>
        <Elements.Layout.SectionWithMargin>
          {booking.metadata.cargo && (
            <CapitalizeParagraph>
              <Elements.Typography.SpanBold>
                Innehåll:{' '}
              </Elements.Typography.SpanBold>
              {booking.metadata.cargo}
            </CapitalizeParagraph>
          )}
          <Paragraph>
            <Elements.Typography.SpanBold>
              Ömtåligt:{' '}
            </Elements.Typography.SpanBold>
            {booking.metadata.fragile ? 'Ja' : 'Nej'}
          </Paragraph>
          {booking.size.measurement && (
            <Paragraph>
              <Elements.Typography.SpanBold>
                Mått:{' '}
              </Elements.Typography.SpanBold>
              {booking.size.measurement.map((item: number, index: number) =>
                booking.size.measurement.length === index + 1
                  ? `${item} cm `
                  : `${item}x`
              )}
            </Paragraph>
          )}
          {booking.size.weight && (
            <Paragraph>
              <Elements.Typography.SpanBold>
                Vikt:{' '}
              </Elements.Typography.SpanBold>
              {`${booking.size.weight} kg`}
            </Paragraph>
          )}
        </Elements.Layout.SectionWithMargin>
        <Elements.Layout.SectionWithMargin>
          <Elements.Layout.MarginBottomContainer>
            <Elements.Typography.StrongParagraph>
              Upphämtning
            </Elements.Typography.StrongParagraph>
            <CapitalizeParagraph>{booking.pickup.street}</CapitalizeParagraph>
            {booking.pickup.time_windows &&
              booking.pickup.time_windows.map((timeWindow) => (
                <Elements.Typography.SmallInfoBold key={timeWindow.earliest}>
                  {moment(timeWindow.earliest).isSame(timeWindow.latest, 'day')
                    ? `${moment(timeWindow.earliest).format(
                        'YYYY-MM-DD, hh:mm'
                      )} - ${moment(timeWindow.latest).format('hh:mm')}`
                    : `${moment(timeWindow.earliest).format(
                        'YYYY-MM-DD, hh:mm'
                      )} -
              ${moment(timeWindow.latest).format('YYYY-MM-DD, hh:mm')}`}
                </Elements.Typography.SmallInfoBold>
              ))}
          </Elements.Layout.MarginBottomContainer>
          {booking.metadata.sender.name && (
            <Elements.Layout.FlexRowBaselineContainer>
              <Elements.Icons.MarginRightIcon
                src={ContactName}
                alt="Contact Avatar"
              />
              <CapitalizeParagraph>
                {booking.metadata.sender.name}
              </CapitalizeParagraph>
            </Elements.Layout.FlexRowBaselineContainer>
          )}
          <Elements.Layout.FlexRowBaselineContainer>
            <Elements.Icons.MarginRightIcon
              src={ContactPhone}
              alt="Contact Phone"
            />
            <Paragraph>{booking.metadata.sender.contact}</Paragraph>
          </Elements.Layout.FlexRowBaselineContainer>
        </Elements.Layout.SectionWithMargin>
        <Elements.Layout.SectionWithMargin>
          <Elements.Layout.MarginBottomContainer>
            <Elements.Typography.StrongParagraph>
              Avlämning
            </Elements.Typography.StrongParagraph>
            <CapitalizeParagraph>{booking.delivery.street}</CapitalizeParagraph>

            {booking.delivery.time_windows &&
              booking.delivery.time_windows.map((timeWindow: any) => (
                <Elements.Typography.SmallInfoBold key={timeWindow.earliest}>
                  {moment(timeWindow.earliest).format('YYYY-MM-DD, hh:mm')} -{' '}
                  {moment(timeWindow.latest).format('YYYY-MM-DD, hh:mm')}
                </Elements.Typography.SmallInfoBold>
              ))}
          </Elements.Layout.MarginBottomContainer>
          {booking.metadata.sender.name && (
            <Elements.Layout.FlexRowBaselineContainer>
              <Elements.Icons.MarginRightIcon
                src={ContactName}
                alt="Contact Avatar"
              />
              <CapitalizeParagraph>
                {booking.metadata.recipient.name}
              </CapitalizeParagraph>
            </Elements.Layout.FlexRowBaselineContainer>
          )}
          <Elements.Layout.FlexRowBaselineContainer>
            <Elements.Icons.MarginRightIcon
              src={ContactPhone}
              alt="Contact Phone"
            />
            <Paragraph>{booking.metadata.recipient.contact}</Paragraph>
          </Elements.Layout.FlexRowBaselineContainer>
        </Elements.Layout.SectionWithMargin>
        <Elements.Layout.MarginTopContainer>
          <Elements.Typography.StrongParagraph>
            Föreslagen transport
          </Elements.Typography.StrongParagraph>

          <Elements.Links.RoundedLink to={`/transports/${routeId}`}>
            {helpers.withoutLastFourChars(routeId)}
            <Elements.Typography.SpanBold>
              {helpers.getLastFourChars(routeId)}
            </Elements.Typography.SpanBold>
          </Elements.Links.RoundedLink>
        </Elements.Layout.MarginTopContainer>

        <Elements.Layout.MarginTopContainer
          alignItems="center"
          marginTop={'4rem'}
        >
          <Elements.Buttons.CancelButton
            onClick={() => handleDeleteClick(bookingId)}
          >
            Ta bort från rutt
          </Elements.Buttons.CancelButton>
        </Elements.Layout.MarginTopContainer>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default PlanBookingDetails
