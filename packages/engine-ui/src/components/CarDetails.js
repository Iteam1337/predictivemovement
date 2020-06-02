import React from 'react'

import Elements from './Elements'

const CarDetails = ({ car }) => {
  if (!car) return <p>Loading...</p>

  return (
    <div>
      <Elements.StrongParagraph>ID:</Elements.StrongParagraph>
      <span>{car.id}</span>

      
    </div>
  )
}

export default CarDetails
