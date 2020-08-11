import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { FlyToInterpolator } from 'react-map-gl'
import { ViewportContext } from '../utils/ViewportContext'

const CarsContainer = styled.div`
  a:not(:first-child) {
    margin-top: 0.5rem;
  }
`

const CarListItem = styled(Link)`
  background: #e6ffe6;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  color: black;
  :visited {
    color: black;
  }
  :hover {
    background: #ccffcc;
  }
`

const NoCarsInfo = styled.p`
  font-style: italic;
  font-size: 0.875rem;
`

const Cars = ({ cars }) => {
  const { setViewport } = React.useContext(ViewportContext)
  if (!cars.length)
    return <NoCarsInfo>Det finns inga aktuella bilar...</NoCarsInfo>

  return (
    <CarsContainer>
      {cars.map((car) => (
        <CarListItem
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
        </CarListItem>
      ))}
    </CarsContainer>
  )
}

export default Cars
