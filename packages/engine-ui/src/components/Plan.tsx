import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import * as Icons from '../assets/Icons'
import * as Elements from '../shared-elements'
import * as types from '../types'
import * as helpers from '../utils/helpers'
import * as stores from '../utils/state/stores'
import NotFound from './NotFound'
import PlanBookingDetails from './PlanBookingDetails'
import PlanRouteDetails from './PlanRouteDetails'
import Success from './SuccessScreen'

const bookingStatusToReadable = (status: string) => {
  switch (status) {
    case 'TIME_CONSTRAINTS_EXPIRED':
      return 'Tidsfönster passerat'
    case 'CONSTRAINTS_FAILURE':
    default:
      return 'Okänd anledning'
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

interface PlanProps {
  dispatchOffers: (params: any) => void
  moveBooking: (bookingId: string, transportId: string) => void
}

const Wrapper = styled.div`
  margin-top: 10px;
  display: flex;
  height: 23%;
  flex-direction: column;
`

const BookingToggleList: React.FC<{
  excludedBookings: types.ExcludedBooking[]
  text: string
  onClickHandler: (lat: number, lon: number) => void
  onMouseEnterHandler: (id?: string) => void
  isOpen: boolean
  setOpen: () => void
}> = ({
  excludedBookings,
  text,
  onClickHandler,
  onMouseEnterHandler,
  isOpen,
  setOpen,
}) => (
  <Wrapper>
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
          {excludedBookings.map((booking) => (
            <li key={booking.id}>
              <Elements.Layout.InlineContainer>
                <Elements.Links.RoundedLink
                  onMouseOver={() => onMouseEnterHandler(booking.id)}
                  onMouseLeave={() => onMouseEnterHandler()}
                  to={`/bookings/${booking.id}`}
                  onClick={() => onClickHandler(booking.lat, booking.lon)}
                >
                  {helpers.getLastFourChars(booking.id).toUpperCase()}
                </Elements.Links.RoundedLink>
                <Paragraph>{bookingStatusToReadable(booking.status)}</Paragraph>
              </Elements.Layout.InlineContainer>
            </li>
          ))}
        </Elements.Layout.BookingList>
      )}
    </Elements.Layout.MarginBottomContainer>
  </Wrapper>
)

const Plan: React.FC<PlanProps> = ({ dispatchOffers, moveBooking }) => {
  const history = useHistory()
  const setMapLayers = stores.mapLayerState((state) => state.set)

  const [plan, bookings, transports] = stores.dataState((state) => [
    state.plan,
    state.bookings,
    state.transports,
  ])

  React.useEffect(() => {
    setMapLayers({ type: 'plan' })
  }, [setMapLayers, plan])

  const activeRoutes = plan.routes.filter(
    (d) => d.activities && d.activities.length > 0
  )

  const [expandedSection, setExpandedSection] = React.useState({
    isOpen: false,
  })

  const { path } = useRouteMatch()
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)
  const [isFinished, setIsFinished] = React.useState(false)

  const onClickHandler = (latitude: number, longitude: number) =>
    setMap({
      latitude,
      longitude,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t: number) => t * (2 - t),
    })

  const onMouseEnter = (id?: string) =>
    setUIState({ type: 'highlightBooking', payload: id })

  const handleExpand = () =>
    setExpandedSection((currentState) => ({
      ...currentState,
      isOpen: !currentState.isOpen,
    }))

  const handleOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    dispatchOffers(event)
    setIsFinished(true)
  }

  const handleOnClose = () => history.push('/transports')

  if (isFinished)
    return (
      <Success
        onClose={handleOnClose}
        infoText="Planen är nu bekräftad och rutten tillagd på respektive transport"
      />
    )

  return (
    <Switch>
      <Route exact path={[path, `${path}/routes/:routeId`]}>
        <PlanWrapper>
          <h3>Föreslagen plan</h3>
          {!activeRoutes.length && !plan.excludedBookings.length ? (
            <Elements.Typography.NoInfoParagraph>
              Det finns inga föreslagna rutter...
            </Elements.Typography.NoInfoParagraph>
          ) : (
            <>
              {!activeRoutes.length && (
                <Elements.Typography.NoInfoParagraph>
                  Planen saknar inkluderade bokningar...
                </Elements.Typography.NoInfoParagraph>
              )}
              {activeRoutes.map((route, i) => (
                <PlanRouteDetails
                  key={i}
                  moveBooking={moveBooking}
                  route={route}
                  routeNumber={i + 1}
                  transports={transports}
                  color={
                    transports.find((transport) => transport.id === route.id)
                      ?.color
                  }
                />
              ))}
              {plan.excludedBookings.length > 0 && (
                <BookingToggleList
                  excludedBookings={plan.excludedBookings}
                  text="Exkluderade bokningar"
                  onClickHandler={onClickHandler}
                  onMouseEnterHandler={onMouseEnter}
                  isOpen={expandedSection.isOpen}
                  setOpen={handleExpand}
                />
              )}

              {activeRoutes.length > 0 && (
                <Elements.Buttons.SubmitButton
                  alignSelf="center"
                  marginTop="2rem"
                  onClick={handleOnClick}
                >
                  Bekräfta plan
                </Elements.Buttons.SubmitButton>
              )}
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
      <Route component={NotFound} />
    </Switch>
  )
}

export default Plan
