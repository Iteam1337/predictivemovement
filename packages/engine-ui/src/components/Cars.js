import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import { ViewportContext } from '../utils/ViewportContext'
import Elements from './Elements'
import Icons from '../assets/Icons'
import styled from 'styled-components'

const PageTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  button {
    background: none;
    border: none;
  }
  button:focus {
    outline: none;
  }
`

const Cars = ({ cars }) => {
  const { setViewport } = React.useContext(ViewportContext)
  const [showCars, toggleShowCars] = React.useState(true)

  return (
    <>
      <PageTitleWrapper>
        <h3>Aktuella fordon</h3>
        <button onClick={() => toggleShowCars((showCars) => !showCars)}>
          <Icons.Arrow active={showCars} />
        </button>
      </PageTitleWrapper>

      {showCars &&
        (cars.length ? (
          <Elements.LinkListContainer>
            {cars.map((car) => (
              <Elements.RoundedLink
                to={`/details?type=car&id=${car.id}`}
                key={car.id}
                onClick={() =>
                  setViewport({
                    latitude: car.position.lat,
                    longitude: car.position.lon,
                    zoom: 17,
                    transitionDuration: 3000,
                    transitionInterpolator: new FlyToInterpolator(),
                    transitionEasing: (t) => t * (2 - t),
                  })
                }
              >
                {car.id}
              </Elements.RoundedLink>
            ))}
          </Elements.LinkListContainer>
        ) : (
          <Elements.NoInfoParagraph>
            Det finns inga aktuella bilar...
          </Elements.NoInfoParagraph>
        ))}
      <Elements.TextLink to="/add-vehicle">
        <h3>+ Lägg till bil</h3>
      </Elements.TextLink>
    </>
  )
}

export default Cars
