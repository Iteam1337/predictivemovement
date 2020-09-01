import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import { UIStateContext } from '../utils/UIStateContext'
import Elements from './Elements'

const Cars = ({ cars }) => {
  const { dispatch } = React.useContext(UIStateContext)
  if (!cars.length)
    return (
      <Elements.NoInfoParagraph>
        Det finns inga aktuella transporter...
      </Elements.NoInfoParagraph>
    )

  return (
    <Elements.LinkListContainer>
      {cars.map((car) => (
        <Elements.RoundedLink
          to={`/details?type=vehicle&id=${car.id}`}
          key={car.id}
          onClick={() =>
            dispatch({
              type: 'viewport',
              payload: {
                latitude: car.start_address.lat,
                longitude: car.start_address.lon,
                zoom: 10,
                transitionDuration: 3000,
                transitionInterpolator: new FlyToInterpolator(),
                transitionEasing: (t) => t * (2 - t),
              },
            })
          }
        >
          {car.id}
        </Elements.RoundedLink>
      ))}
    </Elements.LinkListContainer>
  )
}

export default Cars
