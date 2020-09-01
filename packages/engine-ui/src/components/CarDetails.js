import React from 'react'
import styled from 'styled-components'
import Elements from '../shared-elements'
import RouteActivities from './RouteActivities'
import NestedMenu from './layout/NestedMenu'
import moment from 'moment'
import Icons from '../assets/Icons'
import { ViewportContext } from '../utils/ViewportContext'
import { FlyToInterpolator } from 'react-map-gl'

const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`

const Paragraph = styled.p`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

const RouteTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 10%;
  align-items: baseline;
  justify-items: flex-start;
  width: 100%;
  margin-bottom: 1rem;

  button {
    background: none;
    border: none;
    justify-self: end;
  }

  button:focus {
    outline: none;
  }
`

const CarDetails = ({ vehicle }) => {
  const { setViewport } = React.useContext(ViewportContext)
  const [showInfo, setShowInfo] = React.useState({
    route: false,
    bookings: false,
    status: false,
  })

  if (!vehicle) return <p>Loading...</p>

  const handleOnLinkClick = (id) => {
    const activitie = vehicle.activities.filter(
      (activitie) => activitie.id === id
    )
    setViewport({
      latitude: activitie[0].address.lon,
      longitude: activitie[0].address.lat,
      zoom: 17,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t) => t * (2 - t),
    })
  }

  return (
    <NestedMenu>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Transport</h3>
          <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
            {vehicle.id}
          </Elements.Typography.RoundedLabelDisplay>
        </Elements.Layout.FlexRowWrapper>
        {vehicle.capacity && (
          <>
            <Elements.Typography.StrongParagraph>
              Kapacitet
            </Elements.Typography.StrongParagraph>
            <Paragraph>Maxvolym: {vehicle.capacity.volume}kbm</Paragraph>
            <Paragraph>Maxvikt: {vehicle.capacity.weight}kg</Paragraph>
          </>
        )}
        <Elements.Typography.StrongParagraph>
          Körschema
        </Elements.Typography.StrongParagraph>
        <Elements.Layout.FlexRowWrapper>
          <Paragraph>
            {moment(vehicle.earliest_start).format('LT')} -{' '}
            {moment(vehicle.latest_end).format('LT')}{' '}
          </Paragraph>
        </Elements.Layout.FlexRowWrapper>
        {vehicle.end_address.name && (
          <Paragraph>Slutposition: {vehicle.end_address.name}</Paragraph>
        )}
        <Line />

        {vehicle.activities && vehicle.activities.length > 0 && (
          <>
            <RouteTitleWrapper>
              <Elements.Typography.StrongParagraph>
                Bokingar på fordon
              </Elements.Typography.StrongParagraph>
              <button
                onClick={() => {
                  setShowInfo((showInfo) => ({
                    bookings: !showInfo.bookings,
                    route: false,
                    status: false,
                  }))
                }}
              >
                <Icons.Arrow active={showInfo.bookings} />
              </button>
            </RouteTitleWrapper>
            {showInfo.bookings && (
              <Elements.Layout.LinkListContainer>
                {vehicle.booking_ids.map((bookingId) => (
                  <Elements.Links.RoundedLink
                    to={`/details?type=booking&id=${bookingId}`}
                    key={bookingId}
                    onClick={() => handleOnLinkClick(bookingId)}
                  >
                    {bookingId}
                  </Elements.Links.RoundedLink>
                ))}
              </Elements.Layout.LinkListContainer>
            )}
            <RouteTitleWrapper>
              <Elements.Typography.StrongParagraph>
                Rutt
              </Elements.Typography.StrongParagraph>
              <button
                onClick={() => {
                  setShowInfo((showInfo) => ({
                    route: !showInfo.route,
                    bookings: false,
                    status: false,
                  }))
                }}
              >
                <Icons.Arrow active={showInfo.route} />
              </button>
            </RouteTitleWrapper>
            {showInfo.route && <RouteActivities vehicle={vehicle} />}
            <RouteTitleWrapper>
              <Elements.Typography.StrongParagraph>
                Status
              </Elements.Typography.StrongParagraph>
              <button
                onClick={() => {
                  setShowInfo((showInfo) => ({
                    status: !showInfo.status,
                    bookings: false,
                    route: false,
                  }))
                }}
              >
                <Icons.Arrow active={showInfo.status} />
              </button>
            </RouteTitleWrapper>
            {showInfo.status && <h6>Status</h6>}
          </>
        )}
      </Elements.Layout.Container>
    </NestedMenu>
  )
}

export default CarDetails
