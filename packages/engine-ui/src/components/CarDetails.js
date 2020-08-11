import React from 'react'

import Elements from './Elements'
import { Link } from 'react-router-dom'

const CarDetails = ({ car }) => {
  if (!car) return <p>Loading...</p>

  return (
    <div>
      <Elements.StrongParagraph>ID:</Elements.StrongParagraph>
      <span>{car.id}</span>
      <Link to={`/driver/${car.id}`}>
        <h3>Öppna körschema </h3>
      </Link>
    </div>
  )
}

export default CarDetails
