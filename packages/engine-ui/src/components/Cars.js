import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const CarsContainer = styled.div`
  a:not(:first-child) {
    margin-top: 0.5rem;
  }
`

const CarListItem = styled(Link)`
  background: #e6f5ff;
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
    background: #abd4ed;
  }
`

const NoCarsInfo = styled.p`
  font-style: italic;
  font-size: 0.875rem;
`
const Cars = ({ cars }) => {
  if (!cars.length)
    return <NoCarsInfo>Det finns inga aktuella bilar...</NoCarsInfo>

  return (
    <CarsContainer>
      {cars.map((car) => {
        return (
          <CarListItem
            to={`/details?type=car&id=${car.id}`}
            key={car.id}
          >
            {car.id}
          </CarListItem>
        )
      })}
    </CarsContainer>
  )
}

export default Cars
