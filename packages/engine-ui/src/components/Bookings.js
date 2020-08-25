import React from 'react'
import { ViewportContext } from '../utils/ViewportContext'
import { FlyToInterpolator } from 'react-map-gl'
import Elements from './Elements'

const Bookings = ({ bookings }) => {
  const { setViewport } = React.useContext(ViewportContext)
  if (!bookings.length)
    return (
      <Elements.NoInfoParagraph>
        Det finns inga aktuella bokningar...
      </Elements.NoInfoParagraph>
    )

  return (
    <Elements.LinkListContainer>
      {bookings.map((booking) => (
        <Elements.RoundedLink
          to={`/details?type=booking&id=${booking.id}`}
          key={booking.id}
          onClick={() =>
            setViewport({
              latitude: booking.pickup.lat,
              longitude: booking.pickup.lon,
              zoom: 10,
              transitionDuration: 2000,
              transitionInterpolator: new FlyToInterpolator(),
              transitionEasing: (t) => t * (2 - t),
            })
          }
        >
          {booking.id}
        </Elements.RoundedLink>
      ))}
    </Elements.LinkListContainer>
  )
}

export default Bookings
