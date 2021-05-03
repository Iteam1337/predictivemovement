import React from 'react'
import * as Elements from '../shared-elements/'
import { useRouteMatch, Route, Link, Switch } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import CreateBooking from './CreateBooking'
import * as types from '../types'
import NotFound from './NotFound'
import * as helpers from '../utils/helpers'
import * as stores from '../utils/state/stores'
import EditBooking from './EditBooking'

const sortBookingsByStatus = (bookings: types.Booking[]) =>
  bookings.reduce<{
    new: types.Booking[]
    assigned: types.Booking[]
    delivered: types.Booking[]
    delivery_failed: types.Booking[]
    picked_up: types.Booking[]
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
  bookings: types.Booking[]
  text: string
  onMouseEnterHandler: (id: string) => void
  onMouseLeaveHandler: () => void
  isOpen: boolean
  setOpen: () => void
}> = ({
  bookings,
  text,

  onMouseEnterHandler,
  onMouseLeaveHandler,
  isOpen,
  setOpen,
}) => {
  const setMap = stores.map((state) => state.set)
  return (
    <Elements.Layout.MarginBottomContainer>
      <Elements.Layout.FlexRowWrapper onClick={setOpen}>
        <Elements.Icons.Chevron
          active={isOpen.toString()}
          style={{
            width: isOpen ? '16px' : '13px',
            marginRight: isOpen ? '0.7rem' : '0.875rem',
          }}
        />
        <Elements.Typography.CleanH3>{text}</Elements.Typography.CleanH3>
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
                      helpers.focusMapOnClick(
                        booking.pickup.lat,
                        booking.pickup.lon,
                        setMap
                      )
                    }
                    hoverbackground={'#CCFFCC'}
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

const Bookings: React.FC<{
  createBooking: (params: any) => void
  deleteBooking: (params: any) => void
  updateBooking: (params: any) => void
}> = (props) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const setMapLayers = stores.mapLayerState((state) => state.set)
  const bookings = stores.dataState((state) => state.bookings)
  const { url } = useRouteMatch()
  const bookingsRootView = useRouteMatch({ path: '/bookings', strict: true })

  const sortedBookings = React.useMemo(() => sortBookingsByStatus(bookings), [
    bookings,
  ])

  React.useEffect(() => {
    if (bookingsRootView?.isExact) {
      setMapLayers({ type: 'bookingIcons' })
    }
  }, [setMapLayers, bookings, bookingsRootView])

  const [expandedSection, setExpandedSection] = React.useState({
    new: true,
    assigned: false,
    delivered: false,
  })

  const handleExpand = (type: 'new' | 'assigned' | 'delivered') =>
    setExpandedSection((currentState) => ({
      ...currentState,
      [type]: !currentState[type],
    }))

  const onBookingDetailsUnmount = React.useCallback(
    () => setMapLayers({ type: 'bookingIcons' }),
    [setMapLayers]
  )

  const onBookingDetailsMount = React.useCallback(
    () => setUIState({ type: 'highlightBooking', payload: undefined }),
    [setUIState]
  )

  return (
    <Switch>
      <Route exact path={'/bookings'}>
        <Elements.Layout.MarginTopContainer>
          <BookingToggleList
            isOpen={expandedSection.new}
            setOpen={() => handleExpand('new')}
            bookings={sortedBookings.new}
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
            bookings={[...sortedBookings.assigned, ...sortedBookings.picked_up]}
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
            bookings={sortedBookings.delivered}
            text="Levererade bokningar"
            onMouseEnterHandler={(id: string) =>
              setUIState({ type: 'highlightBooking', payload: id })
            }
            onMouseLeaveHandler={() =>
              setUIState({ type: 'highlightBooking', payload: undefined })
            }
          />
        </Elements.Layout.MarginTopContainer>
        <Elements.Layout.FlexRowInCenterMarginL>
          <Link to={`${url}/add-booking`}>
            <Elements.Buttons.SubmitButton color="#666666">
              + Lägg till bokning
            </Elements.Buttons.SubmitButton>
          </Link>
        </Elements.Layout.FlexRowInCenterMarginL>
      </Route>

      <Route exact path={`${'/bookings'}/add-booking`}>
        <CreateBooking onSubmit={props.createBooking} />
      </Route>

      <Route exact path={`${'/bookings'}/edit-booking/:bookingId`}>
        <EditBooking bookings={bookings} updateBooking={props.updateBooking} />
      </Route>

      <Route exact path={`${'/bookings'}/:bookingId`}>
        <BookingDetails
          bookings={bookings}
          deleteBooking={props.deleteBooking}
          onUnmount={onBookingDetailsUnmount}
          onMount={onBookingDetailsMount}
        />
      </Route>
      <Route component={NotFound} />
    </Switch>
  )
}

export default Bookings
