import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import * as Elements from '../shared-elements/'
import * as Icons from '../assets/Icons'
import { useRouteMatch, Route, Link, Switch } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import CreateBooking from './CreateBooking'
import styled from 'styled-components'
import { Booking } from '../types'
import NotFound from './NotFound'

import * as helpers from '../utils/helpers'
import * as stores from '../utils/state/stores'

const sortBookingsByStatus = (bookings: Booking[]) =>
  bookings.reduce<{
    new: Booking[]
    assigned: Booking[]
    delivered: Booking[]
    delivery_failed: Booking[]
    picked_up: Booking[]
  }>(
    (prev, current) => ({
      ...prev,
      [current.status]: prev[current.status].concat([current]),
    }),
    {
      new: [],
      assigned: [],
      delivered: [],
      delivery_failed: [],
      picked_up: [],
    }
  )

const BookingToggleList: React.FC<{
  bookings: Booking[]
  text: string
  onClickHandler: (lat: number, lon: number) => void
  onMouseEnterHandler: (id: string) => void
  onMouseLeaveHandler: () => void
  isOpen: boolean
  setOpen: () => void
}> = ({
  bookings,
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
            {bookings.length === 0 && (
              <Elements.Typography.NoInfoParagraph>
                Just nu finns det inget här...
              </Elements.Typography.NoInfoParagraph>
            )}
            {bookings.length > 0 &&
              bookings.map((booking) => (
                <li key={booking.id}>
                  <Elements.Layout.InlineContainer>
                    <Elements.Links.RoundedLink
                      onMouseOver={() => onMouseEnterHandler(booking.id)}
                      onMouseLeave={() => onMouseLeaveHandler()}
                      to={`/bookings/${booking.id}`}
                      onClick={() =>
                        onClickHandler(booking.pickup.lat, booking.pickup.lon)
                      }
                    >
                      {helpers.getLastFourChars(booking.id).toUpperCase()}
                    </Elements.Links.RoundedLink>
                  </Elements.Layout.InlineContainer>
                </li>
              ))}
          </Elements.Layout.BookingList>
        )}
      </Elements.Layout.MarginBottomContainer>
    )
  }

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Bookings: React.FC<{
  bookings: Booking[]
  createBooking: (params: any) => void
  deleteBooking: (params: any) => void
}> = (props) => {
  const setMap = stores.map((state) => state.set)
  const setUIState = stores.ui((state) => state.dispatch)
  const { path, url } = useRouteMatch()

  const bookings = React.useMemo(() => sortBookingsByStatus(props.bookings), [
    props.bookings,
  ])

  const [expandedSection, setExpandedSection] = React.useState({
    new: true,
    assigned: false,
    delivered: false,
  })

  const onClickHandler = (latitude: number, longitude: number) =>
    setMap({
      latitude,
      longitude,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t: number) => t * (2 - t),
    })

  const handleExpand = (type: 'new' | 'assigned' | 'delivered') =>
    setExpandedSection((currentState) => ({
      ...currentState,
      [type]: !currentState[type],
    }))

  return (
    <Wrapper>
      <Switch>
        <Route exact path={path}>
          <Elements.Layout.MarginTopContainer>
            <BookingToggleList
              isOpen={expandedSection.new}
              setOpen={() => handleExpand('new')}
              bookings={bookings.new}
              onClickHandler={onClickHandler}
              text="Öppna bokningar"
              onMouseEnterHandler={(id: string) =>
                setUIState({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                setUIState({ type: 'highlightBooking', payload: undefined })
              }
            />
            <BookingToggleList
              isOpen={expandedSection.assigned}
              setOpen={() => handleExpand('assigned')}
              bookings={[...bookings.assigned, ...bookings.picked_up]}
              onClickHandler={onClickHandler}
              text="Bekräftade bokningar"
              onMouseEnterHandler={(id: string) =>
                setUIState({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                setUIState({ type: 'highlightBooking', payload: undefined })
              }
            />
            <BookingToggleList
              isOpen={expandedSection.delivered}
              setOpen={() => handleExpand('delivered')}
              bookings={bookings.delivered}
              onClickHandler={onClickHandler}
              text="Levererade bokningar"
              onMouseEnterHandler={(id: string) =>
                setUIState({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                setUIState({ type: 'highlightBooking', payload: undefined })
              }
            />
          </Elements.Layout.MarginTopContainer>
          <Elements.Layout.FlexRowInCenter>
            <Link to={`${url}/add-booking`}>
              <Elements.Buttons.SubmitButton color="#666666">
                + Lägg till bokning
              </Elements.Buttons.SubmitButton>
            </Link>
          </Elements.Layout.FlexRowInCenter>
        </Route>

        <Route exact path={`${path}/add-booking`}>
          <CreateBooking onSubmit={props.createBooking} />
        </Route>

        <Route exact path={`${path}/:bookingId`}>
          <BookingDetails
            bookings={props.bookings}
            deleteBooking={props.deleteBooking}
            onUnmount={() =>
              setUIState({ type: 'highlightBooking', payload: undefined })
            }
          />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Wrapper>
  )
}

export default Bookings
