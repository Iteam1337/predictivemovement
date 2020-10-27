import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import Elements from '../shared-elements'
import PlanRouteDetails from './PlanRouteDetails'
import Icons from '../assets/Icons'
import helpers from '../utils/helpers'
import PlanBookingDetails from './PlanBookingDetails'
import { Plan as IPlan, Transport, Booking, ExcludedBooking } from '../types'
import stores from '../utils/state/stores'
import { FlyToInterpolator } from 'react-map-gl'

const bookingStatusToReadable = (status: string) => {
  switch (status) {
    case "TIME_CONSTRAINTS_EXPIRED":
      return "Tidsfönster passerat";
    case "CONSTRAINTS_FAILURE":
    default:
      return "Okänd anledning"
  }
}

const Paragraph = styled.p`
  margin-bottom: 0.25rem;
  margin-top: 0;
  margin-left: 10px;
`


const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

interface IPlanProps {
  plan: IPlan,
  transports: Transport[]
  dispatchOffers: (params: any) => void
  bookings: Booking[]
}


const BookingToggleList: React.FC<{
  excludedBookings: ExcludedBooking[]
  text: string
  onClickHandler: (lat: number, lon: number) => void
  onMouseEnterHandler: (id: string) => void
  onMouseLeaveHandler: () => void
  isOpen: boolean
  setOpen: () => void
}> = ({
  excludedBookings,
  text,
  onClickHandler,
  onMouseEnterHandler,
  onMouseLeaveHandler,
  isOpen,
  setOpen,
}) => {
  return (
    <Elements.Layout.MarginBottomContainer>
      <Elements.Layout.FlexRowWrapper onClick={setOpen}>
        <Elements.Typography.CleanH4>{text}</Elements.Typography.CleanH4>
        <Icons.Arrow
          style={{
            marginLeft: '0.875rem',
            transform: `rotate(${isOpen ? '180deg' : 0})`,
          }}
        />
      </Elements.Layout.FlexRowWrapper>

      {isOpen && (
        <Elements.Layout.BookingList>
          {excludedBookings.length > 0 &&
            excludedBookings.map((booking) => (
              <li key={booking.id}>
                <Elements.Layout.InlineContainer>
                  <Elements.Links.RoundedLink
                    onMouseOver={() => onMouseEnterHandler(booking.id)}
                    onMouseLeave={() => onMouseLeaveHandler()}
                    to={`/bookings/${booking.id}`}
                    onClick={() => onClickHandler(booking.lat, booking.lon)}
                  >
                    {helpers.getLastFourChars(booking.id).toUpperCase()}
                  </Elements.Links.RoundedLink>
                  <Paragraph>
                    {bookingStatusToReadable(booking.status)}
                  </Paragraph>
                </Elements.Layout.InlineContainer>
              </li>
            ))}
        </Elements.Layout.BookingList>
      )}
    </Elements.Layout.MarginBottomContainer>
  )
}

const Plan = ({
  plan,
  dispatchOffers,
  transports,
  bookings,
}: IPlanProps) => {
  const activeRoutes = plan.routes.filter(
    (d) => d.activities && d.activities.length > 0
  )
  const [expandedSection, setExpandedSection] = React.useState({isOpen: false})
  const { path } = useRouteMatch()
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)
  const onClickHandler = (latitude: number, longitude: number) => setMap({
    latitude,
    longitude,
    zoom: 10,
    transitionDuration: 2000,
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: (t: number) => t * (2 - t),
  })
  const handleExpand = () => setExpandedSection((currentState) => ({
    ...currentState,
    isOpen: !currentState.isOpen,
  }))
  return (
    <Switch>
      <Route exact path={[path, `${path}/routes/:routeId`]}>
        <PlanWrapper>
          <h3>Föreslagen plan</h3>
          {!activeRoutes.length ? (
            <Elements.Typography.NoInfoParagraph>
              Det finns inga föreslagna rutter...
            </Elements.Typography.NoInfoParagraph>
          ) : (
            <>
              {activeRoutes.map((route, i) => (
                <PlanRouteDetails
                  key={i}
                  route={route}
                  routeNumber={i + 1}
                  color={
                    transports.find((transport) => transport.id === route.id)
                      ?.color
                  }
                />
              ))}
            {plan.excludedBookings &&
            <BookingToggleList
              excludedBookings={plan.excludedBookings}
              text="Exkluderade bokningar"
              onClickHandler={onClickHandler}
              onMouseEnterHandler={(id: string) =>
                setUIState({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                setUIState({ type: 'highlightBooking', payload: undefined })
              }
              isOpen={expandedSection.isOpen}
              setOpen={handleExpand}
            />}
              <Elements.Buttons.SubmitButton
                alignSelf="center"
                marginTop="5rem"
                onClick={dispatchOffers}
              >
                Bekräfta plan
              </Elements.Buttons.SubmitButton>
            </>
          )}
        </PlanWrapper>
      </Route>
      <Route exact path={`${path}/routes/:routeId/:activityId`}>
        <PlanBookingDetails
          bookings={bookings}
          onUnmount={() =>
            setUIState({ type: 'highlightBooking', payload: undefined })
          }
        />
      </Route>
      <Route
        exact
        path={[`${path}/current-plan`, `${path}/current-plan/:routeId`]}
      />
    </Switch>
  )
}

export default Plan
