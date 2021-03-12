import React from 'react'
import * as Elements from '../shared-elements'
import * as stores from '../utils/state/stores'
import * as helpers from '../utils/helpers'
import styled from 'styled-components'
import SortHistory from './SortHistory'

const moment = require('moment')

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, fit-content(150px));
  @media (max-width: 768px) {
    background-color: coral;
  }
`

const GridItemColumnTitle = styled.div<{ place: number }>`
  justify-self: center;
  align-self: center;
  grid-column: ${(p) => p.place} / span 1;
  padding: 1rem;
`

const GridItemColumn = styled.div<{ place: number }>`
  justify-self: center;
  align-self: center;
  grid-row: ${(p) => p.place} / span 1;
  font-size: 12px;
  padding: 0.6rem 1rem;
`

const History: React.FC<{}> = () => {
  const transports = stores.dataState((state) => state.transports)
  const bookings = stores.dataState((state) => state.bookings)
  const [selectedFleet, setSelectedFleet] = React.useState('Alla')
  const today = moment().format('YYYY-MM-DD')
  const sevenDaysAgo = moment().subtract(7, 'days').format('YYYY-MM-DD')
  const [fromDate, setFromDate] = React.useState(sevenDaysAgo)
  const [toDate, setToDate] = React.useState(today)

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

  const sortedBookings = deliveredBookingsWithTransport.filter((booking) =>
    booking.day <= toDate && booking.day >= fromDate
      ? selectedFleet === 'Alla'
        ? booking.fleet
        : booking.fleet === selectedFleet
      : null
  )

  return (
    <div style={{ width: '100vw' }}>
      <p>Levererade bokningar</p>
      <SortHistory
        setFromDate={setFromDate}
        setToDate={setToDate}
        setSelectedFleet={setSelectedFleet}
        selectedFleet={selectedFleet}
        uniqueFleets={uniqueFleets}
        fromDate={fromDate}
        toDate={toDate}
      />
      <div>
        {sortedBookings.length === 0 && (
          <p>Inga levererade bokningar mellan dessa datum.</p>
        )}
        {sortedBookings.length > 0 && (
          <GridContainer>
            {titles.map((titel, i) => (
              <GridItemColumnTitle key={i} place={titel.place}>
                {titel.title}
              </GridItemColumnTitle>
            ))}
            {sortedBookings.map((booking, i) => {
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
                    {formatDate(booking.day)}
                  </GridItemColumn>
                  <GridItemColumn place={i + 2}>
                    {formatTime(booking.time)}
                  </GridItemColumn>
                  <GridItemColumn place={i + 2}>
                    {booking.weight}
                  </GridItemColumn>
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
        )}
      </div>
    </div>
  )
}

export default History
