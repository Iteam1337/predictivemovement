import React from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import * as Elements from '../shared-elements'
import * as helpers from '../utils/helpers'
import { Booking } from '../types'
import MainRouteLayout from './layout/MainRouteLayout'
import ContactPhone from '../assets/contact-phone.svg'
import ContactName from '../assets/contact-name.svg'
import moment from 'moment'

interface Props {
  bookings: Booking[]
  onUnmount: () => void
}

const Paragraph = styled.p`
  margin-bottom: 0.25rem;
  margin-top: 0;
`

const CapitalizeParagraph = styled(Paragraph)`
  text-transform: capitalize;
`

const PlanBookingDetails = ({ bookings, onUnmount }: Props) => {
  const history = useHistory()
  const { routeId, activityId } = useParams<{
    routeId: string
    activityId: string
  }>()

  const [booking] = bookings.filter((d) => d.id === activityId)

  const handleDeleteClick = (_activityId: string) => {
    if (
      window.confirm(
        'Är du säker på att du vill ta bort bokningen från den föreslagna planen?'
      )
    ) {
      //function for removing a booking from a plan goes here.
      return history.push(`/plans/routes/${routeId}`)
    }
  }

  React.useEffect(() => () => onUnmount(), [onUnmount])

  if (!bookings) return <p>Laddar bokning...</p>

  if (!booking) return <p>Kunde inte hitta bokning med id: {activityId}</p>

  return (
    <MainRouteLayout redirect={`/plans/routes/${routeId}`}>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Bokning</h3>
          <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
            {helpers.withoutLastFourChars(activityId)}
            <Elements.Typography.SpanBold>
              {helpers.getLastFourChars(activityId)}
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
          {booking.size.measurements && (
            <Paragraph>
              <Elements.Typography.SpanBold>
                Mått:{' '}
              </Elements.Typography.SpanBold>
              {booking.size.measurements.map((item, index) =>
                booking.size.measurements?.length === index + 1
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
            {booking.pickup.timeWindows &&
              booking.pickup.timeWindows.map((timeWindow) => (
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

            {booking.delivery.timeWindows &&
              booking.delivery.timeWindows.map((timeWindow: any) => (
                <Elements.Typography.SmallInfoBold key={timeWindow.earliest}>
                  {moment(timeWindow.earliest).format('YYYY-MM-DD, hh:mm')} -{' '}
                  {moment(timeWindow.latest).format('YYYY-MM-DD, hh:mm')}
                </Elements.Typography.SmallInfoBold>
              ))}
          </Elements.Layout.MarginBottomContainer>
          {booking.metadata.recipient.name && (
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
          </Elements.Links.RoundedLink>
        </Elements.Layout.MarginTopContainer>

        <Elements.Layout.MarginTopContainer
          alignItems="center"
          marginTop={'4rem'}
        >
          <Elements.Buttons.CancelButton
            onClick={() => handleDeleteClick(activityId)}
          >
            Ta bort från rutt
          </Elements.Buttons.CancelButton>
        </Elements.Layout.MarginTopContainer>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default PlanBookingDetails
