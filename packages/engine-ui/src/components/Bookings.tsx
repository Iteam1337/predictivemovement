import React from 'react'
import { ViewportContext } from '../utils/ViewportContext'
import { FlyToInterpolator } from 'react-map-gl'
import Elements from '../shared-elements/'
import Icons from '../assets/Icons'

enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
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
  }>(
    (prev, current) => ({
      ...prev,
      [current.status]: prev[current.status].concat([current]),
    }),
    {
      new: [],
      assigned: [],
      delivered: [],
    }
  )

const BookingToggleList: React.FC<{
  bookings: Booking[]
  text: string
  onClickHandler: (lat: string, lon: string) => void
}> = ({ bookings, text, onClickHandler }) => {
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
                  to={`/details?type=booking&id=${booking.id}`}
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

const Bookings: React.FC<{ bookings: Booking[] }> = (props) => {
  const { setViewport } = React.useContext(ViewportContext)

  const bookings = React.useMemo(() => sortBookingsByStatus(props.bookings), [
    props.bookings,
  ])

  const onClickHandler = (lat: string, lon: string) =>
    setViewport({
      latitude: lat,
      longitude: lon,
      zoom: 10,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t: number) => t * (2 - t),
    })

  return (
    <Elements.Layout.MarginTopContainer>
      <BookingToggleList
        bookings={bookings.new}
        onClickHandler={onClickHandler}
        text="Öppna bokningar"
      />
      <BookingToggleList
        bookings={bookings.assigned}
        onClickHandler={onClickHandler}
        text="Bekräftade bokningar"
      />
      <BookingToggleList
        bookings={bookings.delivered}
        onClickHandler={onClickHandler}
        text="Levererade bokningar"
      />
    </Elements.Layout.MarginTopContainer>
  )
}

export default Bookings
