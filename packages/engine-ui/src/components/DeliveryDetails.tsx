import React from 'react'
import * as Elements from '../shared-elements'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 290px;
  margin-top: 5rem;
  padding-left: 2rem;
`

const DeliveryDetails: React.FC<{ distance: string; duration: string }> = ({
  distance,
  duration,
}) => {
  const getDistance = (distance: number) => {
    return Math.round(distance / 1000)
  }
  const getDuration = (duration: number) => {
    return Math.round(duration / 60)
  }
  return (
    <Wrapper>
      <Elements.Layout.SectionWithMargin>
        <Elements.Typography.StrongParagraph>
          Statistik
        </Elements.Typography.StrongParagraph>
        <Elements.Layout.FlexRowWrapper>
          <Elements.Typography.InfoMd>
            Total körsträcka
          </Elements.Typography.InfoMd>
          <Elements.Typography.InfoMd>
            {getDistance(parseInt(distance))} km
          </Elements.Typography.InfoMd>
        </Elements.Layout.FlexRowWrapper>
        <Elements.Layout.FlexRowWrapper>
          <Elements.Typography.InfoMd>
            Del av körsträcka
          </Elements.Typography.InfoMd>
          <Elements.Typography.InfoMd>17,5 km</Elements.Typography.InfoMd>
        </Elements.Layout.FlexRowWrapper>
        <Elements.Layout.FlexRowWrapper>
          <Elements.Typography.InfoMd>Total körtid</Elements.Typography.InfoMd>
          <Elements.Typography.InfoMd>
            {getDuration(parseInt(duration))} min
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
