import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import RouteActivities from './RouteActivities'
import { FlyToInterpolator } from 'react-map-gl'
import { ViewportContext } from '../utils/ViewportContext'

const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`
const Wrapper = styled.div`
  padding: 2rem;
  width: ${({ width }) => width};
`

const Content = styled.div`
  width: 100%;
  ${({ grid }) =>
    grid && {
      display: 'grid;',
      'grid-template-rows': 'auto 1fr;',
      'grid-template-columns': '1fr 1fr 1fr;',
    }}

  div:first-of-type {
    grid-column: 1 / 4;
    grid-row: 1;
  }

  :nth-child(2) {
    grid-column: 1 / 2;
    grid-row: 2;
  }

  div:last-of-type {
    grid-column: 2 / 3;
    grid-row: 2;
  }
`

const CarDetails = ({ car }) => {
  const { setViewport } = React.useContext(ViewportContext)
  if (!car) return <p>Loading...</p>

  return (
    <Wrapper width={car.activities.length > 0 ? '975px' : '325px'}>
      <Content grid={car.activities.length > 0}>
        <div>
          <Elements.StrongParagraph>Fordon:</Elements.StrongParagraph>
          <span>{car.id}</span>

          <Line />
        </div>
        <div>
          <Elements.StrongParagraph>
            Bokningar på fordon
          </Elements.StrongParagraph>

          <Elements.LinkListContainer>
            {car.activities.length > 0 ? (
              car.activities.slice(1, -1).map((activity, index) => (
                <Elements.RoundedLink
                  to={`#`}
                  onClick={() =>
                    setViewport({
                      latitude: activity.address.lat,
                      longitude: activity.address.lon,
                      zoom: 17,
                      transitionDuration: 2000,
                      transitionInterpolator: new FlyToInterpolator(),
                      transitionEasing: (t) => t * (2 - t),
                    })
                  }
                >
                  {activity.id}
                </Elements.RoundedLink>
              ))
            ) : (
              <p>Inga bekräftade bokingar</p>
            )}
          </Elements.LinkListContainer>
          {!car.activities.length > 0 && <Line />}
        </div>
        <div>
          <Elements.StrongParagraph>Rutt</Elements.StrongParagraph>

          {car.activities.length > 0 ? (
            <RouteActivities car={car} />
          ) : (
            <p>Ingen rutt planerad</p>
          )}
          {!car.activities.length > 0 && <Line />}
        </div>
      </Content>
    </Wrapper>
  )
}

export default CarDetails
