import React from 'react'
import { ViewportContext } from '../utils/ViewportContext'
import { FlyToInterpolator } from 'react-map-gl'
import Elements from './Elements'
import { Route, useRouteMatch, Link } from 'react-router-dom'
import CreateBooking from './CreateBooking'
import CreateBookings from './CreateBookings'
import BookingDetails from './BookingDetails'
import styled from 'styled-components'
import AddFormFieldButton from './forms/inputs/AddFormFieldButton'

const AddNewContainer = styled.div`
  margin-top: 1rem;
`

const Bookings = ({ bookings, createBooking, createBookings }) => {
  const { setViewport } = React.useContext(ViewportContext)
  const { url, path } = useRouteMatch()

  if (!bookings.length)
    return (
      <Elements.NoInfoParagraph>
        Det finns inga aktuella bokningar...
      </Elements.NoInfoParagraph>
    )

  return (
    <>
      <Route exact path={path}>
        <h3>Aktuella bokningar</h3>
        <Elements.LinkListContainer>
          {bookings.map((booking) => (
            <Elements.RoundedLink
              to={`${path}/${booking.id}`}
              key={booking.id}
              onClick={() =>
                setViewport({
                  latitude: booking.pickup.lat,
                  longitude: booking.pickup.lon,
                  zoom: 17,
                  transitionDuration: 2000,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: (t) => t * (2 - t),
                })
              }
            >
              {booking.id}
            </Elements.RoundedLink>
          ))}
        </Elements.LinkListContainer>{' '}
        <AddNewContainer>
          <Link to={`${url}/add-booking`}>
            <AddFormFieldButton>+ Lägg till bokning</AddFormFieldButton>
          </Link>
        </AddNewContainer>
        <AddNewContainer>
          <Link to={`${url}/add-bookings`}>
            <AddFormFieldButton marginTop="0">
              + Generera historiska bokningar
            </AddFormFieldButton>
          </Link>
        </AddNewContainer>
      </Route>
      <Route path={`${path}/:bookingId`}>
        <BookingDetails bookings={bookings} />
      </Route>

      <Route path={`${path}/add-booking`}>
        <CreateBooking createBooking={createBooking} />
      </Route>
      <Route path={`${path}/add-bookings`}>
        <CreateBookings createBookings={createBookings} />
      </Route>
    </>
  )
}

export default Bookings
