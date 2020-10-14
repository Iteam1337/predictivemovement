import React from 'react'
import { UIStateContext } from '../utils/UIStateContext'
import { FlyToInterpolator } from 'react-map-gl'
import Elements from '../shared-elements/'
import Icons from '../assets/Icons'
import { useRouteMatch, Route, Link, Switch } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import CreateBooking from './CreateBooking'
import AddFormFieldButton from './forms/inputs/AddFormFieldButton'
import styled from 'styled-components'
import { Booking } from '../types'
import helpers from '../utils/helpers'
import stores from '../utils/state/stores'

const AddNewContainer = styled.div`
  margin-top: 1rem;
`

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
  createBooking: () => void
  deleteBooking: () => void
}> = (props) => {
  const { dispatch } = React.useContext(UIStateContext)
  const setMap = stores.map((state) => state)
  const { path, url } = useRouteMatch()
  const bookings = React.useMemo(() => sortBookingsByStatus(props.bookings), [
    props.bookings,
  ])

  console.log('ok')

  const [expandedSection, setExpandedSection] = React.useState({
    new: false,
    assigned: false,
    delivered: false,
  })

  const onClickHandler = (latitude: number, longitude: number) =>
    setMap.set({
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
                dispatch({ type: 'highlightBooking', payload: id })
              }
              onMouseLeaveHandler={() =>
                dispatch({ type: 'highlightBooking', payload: undefined })
              }
            />
            <BookingToggleList
              isOpen={expandedSection.assigned}
              setOpen={() => handleExpand('assigned')}
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
              isOpen={expandedSection.delivered}
              setOpen={() => handleExpand('delivered')}
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
        </Route>

        <Route exact path={`${path}/add-booking`}>
          <CreateBooking onSubmit={props.createBooking} />
        </Route>

        <Route path={`${path}/:bookingId`}>
          <BookingDetails
            bookings={props.bookings}
            deleteBooking={props.deleteBooking}
          />
        </Route>
      </Switch>
    </Wrapper>
  )
}

export default Bookings
