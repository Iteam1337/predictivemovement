import React from 'react'

import Elements from './Elements'
import styled from 'styled-components'
import Dot from '../assets/dot.svg'

const Paragraph = styled.p`
  margin: 0;
  margin-bottom: 2.5rem;
  text-transform: capitalize;
`

const Timeline = styled.div`
  ol {
    list-style-type: none;
    padding: 0;
  }

  li {
    position: relative;
    margin: 0;
    padding-bottom: 1em;
    padding-left: 1em;
    display: flex;
    align-items: center;
  }

  img {
    padding-right: 0.5rem;
  }

  li:after {
    content: '';
    background-color: #19de8b;
    position: absolute;
    bottom: 0;
    top: 1px;
    left: 0.3rem;
    width: 2px;
  }

  li:before {
    content: '';
    background-image: url(${Dot});
    position: absolute;
    left: 0;
    top: 0;
    height: 12px;
    width: 12px;
  }

  li:last-child:after {
    content: '';
    width: 0;
  }

  div {
    justify-content: space-between;
    width: 70%;
    margin-top: -2px;
  }
`

const statuses = ['new', 'assigned', 'picked up', 'deliverd']
const BookingDetails = ({ booking }) => {
  const [address, setAddress] = React.useState()
  const getAddressFromCoordinates = async ({ lon, lat }) => {
    return await fetch(
      `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
    )
      .then((res) => res.json())
      .then(({ features }) => features[0].properties.label)
  }

  React.useEffect(() => {
    const setAddressFromCoordinates = async (
      pickupCoordinates,
      deliveryCoordinates
    ) => {
      const pickupAddress = await getAddressFromCoordinates(pickupCoordinates)
      const deliveryAddress = await getAddressFromCoordinates(
        deliveryCoordinates
      )
      setAddress({
        pickup: pickupAddress,
        delivery: deliveryAddress,
      })
    }

    if (!booking) return
    setAddressFromCoordinates(booking.pickup, booking.delivery)
  }, [booking])

  if (!booking || !address) return <p>Loading...</p>

  return (
    <div>
      <Elements.StrongParagraph>Bokning</Elements.StrongParagraph>
      <Paragraph>{booking.id}</Paragraph>

      <Elements.StrongParagraph>Upphämtning</Elements.StrongParagraph>
      <Paragraph>{address.pickup}</Paragraph>
      <Elements.StrongParagraph>Avlämning</Elements.StrongParagraph>
      <Paragraph>{address.delivery}</Paragraph>
      {booking.assigned_to && (
        <>
          <Elements.StrongParagraph>Bokad transport</Elements.StrongParagraph>

          <Elements.RoundedLink
            to={`/details?type=car&id=${booking.assigned_to.id}`}
          >
            {booking.id}
          </Elements.RoundedLink>
        </>
      )}
      <Elements.StrongParagraph>Status:</Elements.StrongParagraph>
      <Timeline>
        <ol>
          {statuses.map((status, index) => (
            <li key={index}>
              <Elements.FlexRowWrapper>
                <Elements.NoMarginParagraph>15.17</Elements.NoMarginParagraph>
                <Elements.NoMarginParagraph>
                  {status}
                </Elements.NoMarginParagraph>
              </Elements.FlexRowWrapper>
            </li>
          ))}
        </ol>
      </Timeline>
      <span>{booking.status}</span>

      {/* <Elements.StrongParagraph>Assigned to: </Elements.StrongParagraph>
      <span>{booking.assigned_to.id}</span> */}
    </div>
  )
}

export default BookingDetails
