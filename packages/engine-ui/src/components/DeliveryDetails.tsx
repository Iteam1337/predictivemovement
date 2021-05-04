import React from 'react'
import * as Elements from '../shared-elements'
import styled from 'styled-components'
import * as stores from '../utils/state/stores'
import { getDistance, getDuration } from '../utils/helpers'
import Signature from './Signature'

const Wrapper = styled.div`
  width: 290px;
  margin-top: 5rem;
  padding-left: 2rem;

  @media (max-width: 645px) {
    width: 100%;
    padding-left: 0;
    margin-top: 1rem;
  }
`

const FlexRowWrapper = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`

const DeliveryDetails: React.FC<{
  distance: string
  duration: string
  bookingId: string
  assignedTo: string
}> = ({ distance, duration, bookingId, assignedTo }) => {
  const transports = stores.dataState((state) => state.transports)
  const signatures = stores.dataState((state) => state.signatures)

  const signature = signatures.find((a) => a.bookingId === bookingId)

  const transport = transports.find((transport) => transport.id === assignedTo)

  const totalDistance = transport?.activities?.reduce(
    (acc, activity) => acc + activity.distance,
    0
  )

  const totalDuration = transport?.activities?.reduce(
    (acc, activity) => acc + activity.duration,
    0
  )

  return (
    <Wrapper>
      <Elements.Layout.SectionWithMargin>
        <Elements.Typography.StrongParagraph>
          Statistik
        </Elements.Typography.StrongParagraph>
        {totalDistance && (
          <FlexRowWrapper>
            <Elements.Typography.InfoMd>
              Total körsträcka
            </Elements.Typography.InfoMd>
            <Elements.Typography.InfoMd>
              {getDistance(totalDistance)}
            </Elements.Typography.InfoMd>
          </FlexRowWrapper>
        )}
        <FlexRowWrapper>
          <Elements.Typography.InfoMd>
            Del av körsträcka
          </Elements.Typography.InfoMd>
          <Elements.Typography.InfoMd>
            {getDistance(parseInt(distance))}
          </Elements.Typography.InfoMd>
        </FlexRowWrapper>
        <Elements.Layout.SectionWithMargin />
        {totalDuration && (
          <FlexRowWrapper>
            <Elements.Typography.InfoMd>
              Total körtid
            </Elements.Typography.InfoMd>
            <Elements.Typography.InfoMd>
              {getDuration(totalDuration)}
            </Elements.Typography.InfoMd>
          </FlexRowWrapper>
        )}
        <FlexRowWrapper>
          <Elements.Typography.InfoMd>Del av körtid</Elements.Typography.InfoMd>
          <Elements.Typography.InfoMd>
            {getDuration(parseInt(duration))}
          </Elements.Typography.InfoMd>
        </FlexRowWrapper>
      </Elements.Layout.SectionWithMargin>
      {signature && <Signature signature={signature} />}
    </Wrapper>
  )
}

export default DeliveryDetails
