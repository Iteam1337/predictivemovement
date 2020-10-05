import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Elements from '../shared-elements'
import RouteActivities from './RouteActivities'
import MainRouteLayout from './layout/MainRouteLayout'
import { useParams } from 'react-router-dom'
import Icons from '../assets/Icons'
import { FlyToInterpolator } from 'react-map-gl'
import { UIStateContext } from '../utils/UIStateContext'
import helpers from '../utils/helpers'

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
  margin-bottom: 0.5rem;

  button {
    background: none;
    border: none;
    justify-self: end;
  }

  button:focus {
    outline: none;
  }
`

const VehicleDetails: React.FC<{
  vehicles: any
  deleteVehicle: (id: string) => void
}> = ({ vehicles, deleteVehicle }) => {
  const { dispatch } = React.useContext(UIStateContext)
  const history = useHistory()

  const [showInfo, setShowInfo] = React.useState({
    route: false,
    bookings: false,
    status: false,
  })

  React.useEffect(
    () => () => dispatch({ type: 'highlightTransport', payload: undefined }),
    [dispatch]
  )

  const { vehicleId } = useParams<{ vehicleId: string }>()
  const vehicle = vehicles.find((v: any) => v.id === vehicleId)

  if (!vehicle) return <p>Loading...</p>

  const handleDeleteClick = (vehicleId: string) => {
    if (window.confirm('Är du säker på att du vill radera transporten?')) {
      deleteVehicle(vehicleId)
      return history.push('/transports')
    }
  }

  const handleOnLinkClick = (id: string) => {
    const activity = vehicle.activities.find(
      (activity: { id: string }) => activity.id === id
    )
    dispatch({
      type: 'viewport',
      payload: {
        latitude: activity.address.lat,
        longitude: activity.address.lon,
        zoom: 14,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t: number) => t * (2 - t),
      },
    })
  }

  return (
    <MainRouteLayout redirect={'/transports'}>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Transport</h3>
          <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
            {helpers.withoutLastFourChars(vehicleId)}
            <Elements.Typography.SpanBold>
              {helpers.getLastFourChars(vehicleId)}
            </Elements.Typography.SpanBold>
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
            {vehicle.earliest_start && vehicle.latest_end
              ? `
                ${vehicle.earliest_start} -
                ${vehicle.latest_end} `
              : 'Inget körschema fastställt'}
          </Paragraph>
        </Elements.Layout.FlexRowWrapper>
        {vehicle.end_address.name && (
          <>
            <Elements.Typography.StrongParagraph>
              Slutposition
            </Elements.Typography.StrongParagraph>
            <Paragraph>{vehicle.end_address.name}</Paragraph>
          </>
        )}
        <Line />

        {vehicle.activities && vehicle.activities.length > 0 ? (
          <>
            <Elements.Layout.MarginBottomContainer>
              <RouteTitleWrapper>
                <Elements.Typography.StrongParagraph>
                  Bokningar på fordon
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
                  {vehicle.booking_ids.map((bookingId: string) => (
                    <Elements.Links.RoundedLink
                      to={`/bookings/${bookingId}`}
                      key={bookingId}
                      onClick={() => handleOnLinkClick(bookingId)}
                    >
                      {helpers.withoutLastFourChars(bookingId)}
                      <Elements.Typography.SpanBold>
                        {helpers.getLastFourChars(bookingId)}
                      </Elements.Typography.SpanBold>
                    </Elements.Links.RoundedLink>
                  ))}
                </Elements.Layout.LinkListContainer>
              )}
            </Elements.Layout.MarginBottomContainer>
            <Elements.Layout.MarginBottomContainer>
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
            </Elements.Layout.MarginBottomContainer>
            <Elements.Layout.MarginBottomContainer>
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
              {showInfo.status && (
                <Elements.Typography.NoInfoParagraph>
                  Det finns ingen status för detta fordonet ännu...
                </Elements.Typography.NoInfoParagraph>
              )}
            </Elements.Layout.MarginBottomContainer>
          </>
        ) : (
          <>
            <Elements.Typography.StrongParagraph>
              Bokningar på fordon
            </Elements.Typography.StrongParagraph>
            <Elements.Typography.NoInfoParagraph>
              Inga bekräftade bokningar
            </Elements.Typography.NoInfoParagraph>
            <Line />
            <Elements.Typography.StrongParagraph>
              Rutt
            </Elements.Typography.StrongParagraph>
            <Elements.Typography.NoInfoParagraph>
              Ingen rutt planerad
            </Elements.Typography.NoInfoParagraph>
          </>
        )}
        <Elements.Layout.MarginTopContainer alignItems="center">
          <Elements.Buttons.CancelButton
            onClick={() => handleDeleteClick(vehicle.id)}
          >
            Radera transport
          </Elements.Buttons.CancelButton>
        </Elements.Layout.MarginTopContainer>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default VehicleDetails
