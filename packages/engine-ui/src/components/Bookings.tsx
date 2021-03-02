import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import * as Elements from '../shared-elements/'
import * as Icons from '../assets/Icons'
import { useRouteMatch, Route, Link, Switch } from 'react-router-dom'
import BookingDetails from './BookingDetails'
import CreateBooking from './CreateBooking'
import * as types from '../types'
import NotFound from './NotFound'
import * as helpers from '../utils/helpers'
import * as stores from '../utils/state/stores'
import EditBooking from './EditBooking'
import Signature from './Signature'

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

const Bookings: React.FC<{
  createBooking: (params: any) => void
  deleteBooking: (params: any) => void
  updateBooking: (params: any) => void
}> = (props) => {
  const setMap = stores.map((state) => state.set)
  const setUIState = stores.ui((state) => state.dispatch)
  const setMapLayers = stores.mapLayerState((state) => state.set)
  const bookings = stores.dataState((state) => state.bookings)
  const { url } = useRouteMatch()
  const bookingsRootView = useRouteMatch({ path: '/bookings', strict: true })
  const signatures = stores.dataState((state) => state.signatures)

  const signature = signatures.find((a) => a.bookingId === 'pmb-ote1zwey')

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
            bookings={[...sortedBookings.assigned, ...sortedBookings.picked_up]}
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
            bookings={sortedBookings.delivered}
            onClickHandler={onClickHandler}
            text="Levererade bokningar"
            onMouseEnterHandler={(id: string) =>
              setUIState({ type: 'highlightBooking', payload: id })
            }
            onMouseLeaveHandler={() =>
              setUIState({ type: 'highlightBooking', payload: undefined })
            }
          />
          {signature && <Signature signature={signature} />}
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
