import React from 'react'
import * as Elements from '../shared-elements'
import styled from 'styled-components'
import * as stores from '../utils/state/stores'

const Wrapper = styled.div`
  width: 290px;
  margin-top: 5rem;
  padding-left: 2rem;
`

const DeliveryDetails: React.FC<{
  distance: string
  duration: string
  bookingId: string
}> = ({ distance, duration, bookingId }) => {
  const transports = stores.dataState((state) => state.transports)

  const transport = transports.find((transport) =>
    transport.bookingIds
      ? transport.bookingIds.map((id) => id === bookingId)
      : null
  )

  const totalDistance = transport?.activities?.reduce(
    (acc, activity) => acc + activity.distance,
    0
  )

  const totalDuration = transport?.activities?.reduce(
    (acc, activity) => acc + activity.duration,
    0
  )

  const getDistance = (distance: number) => {
    const dist = Math.round(distance / 1000)

    return `${dist} km`
  }

  const getDuration = (duration: number) => {
    const num = Math.round(duration / 60)
    const hours = Math.floor(num / 60)
    const minutes = num % 60
    if (hours === 0) {
      return `${minutes}min`
    }
    return `${hours}h ${minutes}min`
  }

  return (
    <Wrapper>
      <Elements.Layout.SectionWithMargin>
        <Elements.Typography.StrongParagraph>
          Statistik
        </Elements.Typography.StrongParagraph>
        {totalDistance && (
          <Elements.Layout.FlexRowWrapper>
            <Elements.Typography.InfoMd>
              Total körsträcka
            </Elements.Typography.InfoMd>
            <Elements.Typography.InfoMd>
              {getDistance(totalDistance)}
            </Elements.Typography.InfoMd>
          </Elements.Layout.FlexRowWrapper>
        )}
        <Elements.Layout.FlexRowWrapper>
          <Elements.Typography.InfoMd>
            Del av körsträcka
          </Elements.Typography.InfoMd>
          <Elements.Typography.InfoMd>
            {getDistance(parseInt(distance))}
          </Elements.Typography.InfoMd>
        </Elements.Layout.FlexRowWrapper>

        {totalDuration && (
          <Elements.Layout.FlexRowWrapper>
            <Elements.Typography.InfoMd>
              Total körtid
            </Elements.Typography.InfoMd>
            <Elements.Typography.InfoMd>
              {getDuration(totalDuration)}
            </Elements.Typography.InfoMd>
          </Elements.Layout.FlexRowWrapper>
        )}
        <Elements.Layout.FlexRowWrapper>
          <Elements.Typography.InfoMd>Del av körtid</Elements.Typography.InfoMd>
          <Elements.Typography.InfoMd>
            {getDuration(parseInt(duration))}
          </Elements.Typography.InfoMd>
        </Elements.Layout.FlexRowWrapper>
      </Elements.Layout.SectionWithMargin>
      <Elements.Layout.SectionWithMargin>
        <Elements.Typography.StrongParagraph>
          Kvittens
        </Elements.Typography.StrongParagraph>
      </Elements.Layout.SectionWithMargin>
    </Wrapper>
  )
}

export default DeliveryDetails
