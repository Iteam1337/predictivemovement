import React from 'react'
import * as Elements from '../shared-elements'
import * as stores from '../utils/state/stores'
import * as helpers from '../utils/helpers'
import styled from 'styled-components'
const moment = require('moment')

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 100px);
  /* grid-auto-rows: 50px; */
  /* grid-template-rows: minmax(auto, auto); */
  width: 1000px;
`

const GridItemColumn = styled.div<{ place: number }>`
  justify-self: center;
  grid-column: ${(p) => p.place} / span 1;
  height: 50px;
`

const GridItemRow = styled.div<{ place: number }>`
  justify-self: center;
  height: 4rem;
  grid-row: ${(p) => p.place} / span 1;
  font-size: 12px;
`

const History: React.FC<{}> = () => {
  const transports = stores.dataState((state) => state.transports)
  const bookings = stores.dataState((state) => state.bookings)

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

  //   const formatTime = (date) => moment(date).format('HH:mm')
  //   const formatDate = (date) => moment(date).format('YYYY-MM-DD')

  return (
    <div style={{ width: '100vw' }}>
      <div style={{ width: '1000px', marginTop: '7rem' }}>
        <GridContainer>
          {titles.map((titel) => (
            <GridItemColumn place={titel.place}>{titel.title}</GridItemColumn>
          ))}
          {deliveredBookings.map((booking, i) => {
            // try to get booking.event in types.

            return (
              <>
                <GridItemRow place={i + 2}>
                  <Elements.Layout.InlineContainer>
                    <Elements.Links.RoundedLink to={`/bookings/${booking.id}`}>
                      {helpers.getLastFourChars(booking.id).toUpperCase()}
                    </Elements.Links.RoundedLink>
                  </Elements.Layout.InlineContainer>
                </GridItemRow>
                <GridItemRow place={i + 2}>
                  {transports.map((t) =>
                    t.bookingIds?.map((a) =>
                      a === booking.id ? t.metadata.fleet : null
                    )
                  )}
                </GridItemRow>
                <GridItemRow place={i + 2}>
                  {transports.map((t) =>
                    t.bookingIds?.map((a) => (a === booking.id ? t.id : null))
                  )}
                </GridItemRow>
                <GridItemRow place={i + 2}>kund</GridItemRow>
                <GridItemRow place={i + 2}>hej</GridItemRow>
                <GridItemRow place={i + 2}>tid</GridItemRow>
                <GridItemRow place={i + 2}>
                  {booking.size.weight ?? ''}
                </GridItemRow>
                <GridItemRow place={i + 2}>dimentioner</GridItemRow>
                <GridItemRow place={i + 2}>sträcka</GridItemRow>
                <GridItemRow place={i + 2}>andel av rutt</GridItemRow>
              </>
            )
          })}
        </GridContainer>
      </div>
    </div>
  )
}

export default History
