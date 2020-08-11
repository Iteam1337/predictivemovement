import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import DriverMap from './components/Driver/DriverMap'

const PlanContainer = styled.div`
  padding: 1rem;
`

const DriverPlan = ({ cars }) => {
  const { id } = useParams()
  const car = cars.filter((s) => s.id === id)

  console.log(car)
  return (
    <PlanContainer>
      <DriverMap state={car[0]} />
    </PlanContainer>
  )
}

export default DriverPlan
