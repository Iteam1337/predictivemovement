import React from 'react'
import * as Elements from '../shared-elements'
import * as stores from '../utils/state/stores'
import * as helpers from '../utils/helpers'
import styled from 'styled-components'

const moment = require('moment')

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 100px);
  width: 1000px;
`

const GridItemColumnTitle = styled.div<{ place: number }>`
  justify-self: center;
  grid-column: ${(p) => p.place} / span 1;
  height: 50px;
`

const GridItemColumn = styled.div<{ place: number }>`
  justify-self: center;
  height: 4rem;
  grid-row: ${(p) => p.place} / span 1;
  font-size: 12px;
`

const FleetInput = styled.div`
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 200px;
  font-size: 0.875rem;
  :focus {
    outline-color: #13c57b;
  }
`

const DropdownButton = styled.button`
  width: inherit;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
  :focus {
    outline-color: #13c57b;
  }
  background-color: #f1f3f5;
`

const FleetText = styled.p`
  padding: 0.55rem;
  margin: 0;
`

const DropDown: React.FC<{
  items: string[]
  handleDropdownSelect: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: string
  ) => void
}> = ({ items, handleDropdownSelect }) => {
  return (
    <>
      {items.map((item, i) => {
        return (
          <DropdownButton
            key={i}
            onMouseDown={(event) => handleDropdownSelect(event, item)}
          >
            {item}
          </DropdownButton>
        )
      })}
    </>
  )
}

const History: React.FC<{}> = () => {
  const transports = stores.dataState((state) => state.transports)
  const bookings = stores.dataState((state) => state.bookings)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [selectedFleet, setSelectedFleet] = React.useState('Alla')
  const handleDropdownSelect = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: string
  ) => {
    event.persist()
    setShowDropdown(false)
    setSelectedFleet(item)
  }

  const deliveredBookings = bookings.filter(
    (booking) => booking.status === 'delivered'
  )

  const titles = [
    { title: 'Bokning', place: 1 },
    { title: 'Flotta', place: 2 },
    { title: 'Transport', place: 3 },
    { title: 'Kund', place: 4 },
    { title: 'Dag', place: 5 },
    { title: 'Tid', place: 6 },
    { title: 'Vikt', place: 7 },
    { title: 'Dimentioner', place: 8 },
    { title: 'Sträcka', place: 9 },
    { title: 'Andel av rutt', place: 10 },
  ]

  const formatTime = (date: string) => moment(date).format('HH:mm')
  const formatDate = (date: string) => moment(date).format('YYYY-MM-DD')

  const getDistance = (distance: number) => {
    return Math.round(distance / 1000)
  }

  const deliveredBookingsWithTransport = deliveredBookings.map((booking) => {
    const transport = transports.find((t) =>
      t.bookingIds?.find((id) => id === booking.id)
    )

    return {
      bookingId: booking.id,
      fleet: (transport && transport.metadata.fleet) || 'Saknas',
      transport: (transport && transport.id) || 'Saknas',
      customer: 'kund',
      day:
        booking.events.find((b) => b.type === 'delivered')?.timestamp ||
        'Saknas',
      time:
        booking.events.find((b) => b.type === 'delivered')?.timestamp ||
        'Saknas',
      weight: booking.size.weight,
      dimensions: 'dimentioner',
      distance: booking.route.distance,
      routePercentage: '100%',
    }
  })

  const fleets = deliveredBookingsWithTransport.map((booking) => booking.fleet)
  const uniqueFleets = fleets.filter(
    (item, index) => fleets.indexOf(item) === index
  )

  const selectedBookings = deliveredBookingsWithTransport.filter((booking) =>
    selectedFleet === 'Alla' ? booking.fleet : booking.fleet === selectedFleet
  )

  return (
    <div style={{ width: '100vw' }}>
      <p>Levererade bokningar</p>

      <div
        style={{
          display: 'flex',
          width: '50%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: '200px' }}>
          <p>Flotta </p>
          <FleetInput
            onBlur={() => setShowDropdown(false)}
            onClick={() => setShowDropdown(true)}
          >
            <FleetText>{selectedFleet}</FleetText>
            {showDropdown && (
              <DropDown
                items={['Alla', ...uniqueFleets]}
                handleDropdownSelect={handleDropdownSelect}
              />
            )}
          </FleetInput>
        </div>

        <p>Fr.o.m. datum</p>
        <p>T.o.m. datum</p>
      </div>
      <div style={{ width: '1000px', marginTop: '7rem' }}>
        <GridContainer>
          {titles.map((titel, i) => (
            <GridItemColumnTitle key={i} place={titel.place}>
              {titel.title}
            </GridItemColumnTitle>
          ))}
          {selectedBookings.map((booking, i) => {
            return (
              <>
                <GridItemColumn place={i + 2}>
                  <Elements.Layout.InlineContainer>
                    <Elements.Links.RoundedLink
                      to={`/bookings/${booking.bookingId}`}
                    >
                      {helpers
                        .getLastFourChars(booking.bookingId)
                        .toUpperCase()}
                    </Elements.Links.RoundedLink>
                  </Elements.Layout.InlineContainer>
                </GridItemColumn>
                <GridItemColumn place={i + 2}>{booking.fleet}</GridItemColumn>
                <GridItemColumn place={i + 2}>
                  {booking.transport}
                </GridItemColumn>
                <GridItemColumn place={i + 2}>kund</GridItemColumn>
                <GridItemColumn place={i + 2}>
                  {formatDate(booking.time)}
                </GridItemColumn>
                <GridItemColumn place={i + 2}>
                  {formatTime(booking.time)}
                </GridItemColumn>
                <GridItemColumn place={i + 2}>{booking.weight}</GridItemColumn>
                <GridItemColumn place={i + 2}>
                  {booking.dimensions}
                </GridItemColumn>
                <GridItemColumn place={i + 2}>
                  {getDistance(booking.distance)} km
                </GridItemColumn>
                <GridItemColumn place={i + 2}>
                  {booking.routePercentage}
                </GridItemColumn>
              </>
            )
          })}
        </GridContainer>
      </div>
    </div>
  )
}

export default History
