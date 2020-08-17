import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import { useHistory } from 'react-router-dom'
import Icons from '../assets/Icons'
import RouteActivities from './RouteActivities'
import { ViewportContext } from '../utils/ViewportContext'
import { FlyToInterpolator } from 'react-map-gl'

const RouteTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% 1fr;
  align-items: baseline;
  justify-items: flex-start;
  width: 100%;

  button {
    background: none;
    border: none;
  }
  button:focus {
    outline: none;
  }
`

const Plans = ({ cars }) => {
  const { setViewport } = React.useContext(ViewportContext)
  const [showRouteInfo, setOpenRouteInfo] = React.useState(false)
  const history = useHistory()
  const driverPlans = cars.filter((d) => d.activities.length > 0)
  const toggle = (id) =>
    setOpenRouteInfo((showRouteInfo) => (showRouteInfo === id ? undefined : id)) // close if currently open
  if (!driverPlans.length)
    return (
      <Elements.NoInfoParagraph>
        Det finns inga planerade rutter...
      </Elements.NoInfoParagraph>
    )

  return (
    <div>
      {driverPlans.map((car, index) => (
        <div key={car.id}>
          <RouteTitleWrapper>
            <Elements.StrongParagraph>
              Rutt {index + 1}
            </Elements.StrongParagraph>
            <button
              onClick={() => {
                toggle(car.id)
                history.push('/')
              }}
            >
              <Icons.Arrow active={showRouteInfo} />
            </button>
          </RouteTitleWrapper>

          {showRouteInfo === car.id && (
            <>
              <Elements.FlexRowWrapper>
                <Elements.StrongParagraph>Fordon</Elements.StrongParagraph>
                <Elements.RoundedLink
                  margin="0 0.5rem"
                  to={`/details?type=car&id=${car.id}`}
                  onClick={() =>
                    setViewport({
                      latitude: car.position.lat,
                      longitude: car.position.lon,
                      zoom: 17,
                      transitionDuration: 3000,
                      transitionInterpolator: new FlyToInterpolator(),
                      transitionEasing: (t) => t * (2 - t),
                    })
                  }
                >
                  {car.id}
                </Elements.RoundedLink>
              </Elements.FlexRowWrapper>
              <RouteActivities car={car} />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default Plans
