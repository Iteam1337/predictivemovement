import React from 'react'
import { UIStateContext } from '../utils/UIStateContext'
import { FlyToInterpolator } from 'react-map-gl'
import Elements from '../shared-elements/'
import Icons from '../assets/Icons'
import { useRouteMatch, Route, Link, Switch } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import CreateBooking from './CreateBooking'
import CreateBookings from './CreateBookings'
import AddFormFieldButton from './forms/inputs/AddFormFieldButton'
import styled from 'styled-components'

const AddNewContainer = styled.div`
  margin-top: 1rem;
`

enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  PICKED_UP = 'picked_up',
}

type Booking = {
  id: string
  pickup: {
    lat: string
    lon: string
  }
  delivery: {
    lat: string
    lon: string
  }
  status: BookingStatus
}

const sortBookingsByStatus = (bookings: Booking[]) =>
  bookings.reduce<{
    new: Booking[]
    assigned: Booking[]
    delivered: Booking[]
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
      picked_up: [],
    }
  )

const BookingToggleList: React.FC<{
  bookings: Booking[]
  text: string
  onClickHandler: (lat: string, lon: string) => void
  onMouseEnterHandler: (id: string) => void
  onMouseLeaveHandler: () => void
}> = ({
  bookings,
  text,
  onClickHandler,
  onMouseEnterHandler,
  onMouseLeaveHandler,
}) => {
  const [toggled, set] = React.useState(false)

  return (
    <Elements.Layout.MarginBottomContainer>
      <Elements.Layout.FlexRowWrapper
        onClick={() => set((currentValue) => !currentValue)}
      >
        <Elements.Typography.CleanH4>{text}</Elements.Typography.CleanH4>
        <Icons.Arrow
          style={{
            marginLeft: '0.875rem',
            transform: `rotate(${toggled ? '180deg' : 0})`,
          }}
        />
      </Elements.Layout.FlexRowWrapper>

      {toggled && (
        <Elements.Layout.BookingList>
          {bookings.length === 0 && (
            <Elements.Typography.NoInfoParagraph>
              Just nu finns det inget här...
            </Elements.Typography.NoInfoParagraph>
          )}
          {bookings.length > 0 &&
            bookings.map((booking) => (
              <li key={booking.id}>
                <Elements.Links.RoundedLink
                  onMouseOver={() => onMouseEnterHandler(booking.id)}
                  onMouseLeave={() => onMouseLeaveHandler()}
                  to={`/bookings/${booking.id}`}
                  onClick={() =>
                    onClickHandler(booking.pickup.lat, booking.pickup.lon)
                  }
                >
                  {booking.id}
                </Elements.Links.RoundedLink>
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
  createBookings: () => void
  createBooking: () => void
  deleteBooking: () => void
}> = (props) => {
  const { dispatch } = React.useContext(UIStateContext)
  const { path, url } = useRouteMatch()
  const bookings = React.useMemo(() => sortBookingsByStatus(props.bookings), [
    props.bookings,
  ])

  const onClickHandler = (lat: string, lon: string) =>
    dispatch({
      type: 'viewport',
      payload: {
        latitude: lat,
        longitude: lon,
        zoom: 10,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t: number) => t * (2 - t),
      },
    })

  return (
    <Wrapper>
      <Switch>
        <Route exact path={path}>
          <Elements.Layout.MarginTopContainer>
            <BookingToggleList
              bookings={bookings.new}
              onClickHandler={onClickHandler}
              text="Öppna bokningar"
              onMouseEnterHandler={(id: string) =>
                dispatch({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                dispatch({ type: 'highlightBooking', payload: undefined })
              }
            />
            <BookingToggleList
              bookings={[...bookings.assigned, ...bookings.picked_up]}
              onClickHandler={onClickHandler}
              text="Bekräftade bokningar"
              onMouseEnterHandler={(id: string) =>
                dispatch({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                dispatch({ type: 'highlightBooking', payload: undefined })
              }
            />
            <BookingToggleList
              bookings={bookings.delivered}
              onClickHandler={onClickHandler}
              text="Levererade bokningar"
              onMouseEnterHandler={(id: string) =>
                dispatch({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                dispatch({ type: 'highlightBooking', payload: undefined })
              }
            />
          </Elements.Layout.MarginTopContainer>
          <AddNewContainer>
            <Link to={`${url}/add-booking`}>
              <AddFormFieldButton onClickHandler={null}>
                + Lägg till bokning
              </AddFormFieldButton>
            </Link>
          </AddNewContainer>
          <AddNewContainer>
            <Link to={`${url}/add-bookings`}>
              <AddFormFieldButton onClickHandler={null} marginTop="0">
                + Generera historiska bokningar
              </AddFormFieldButton>
            </Link>
          </AddNewContainer>
        </Route>

        <Route exact path={`${path}/add-booking`}>
          <CreateBooking onSubmit={props.createBooking} />
        </Route>

        <Route exact path={`${path}/add-bookings`}>
          <CreateBookings onSubmit={props.createBookings} />
        </Route>

      <Route path={`${path}/:bookingId`}>
        <BookingDetails
          onClickHandler={() =>
            dispatch({ type: 'highlightBooking', payload: undefined })
          }
          bookings={props.bookings}
          deleteBooking={props.deleteBooking}
        />
      </Route>
    </Switch>
    </Wrapper>
  )
}

export default Bookings
