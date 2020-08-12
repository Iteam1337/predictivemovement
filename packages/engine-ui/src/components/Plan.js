import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import { useHistory } from 'react-router-dom'
import Icons from '../assets/Icons'
import RouteActivities from './RouteActivities'

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
const Plan = ({ state }) => {
  const [showRouteInfo, setOpenRouteInfo] = React.useState(false)
  const history = useHistory()
  const driverPlanes = state.filter((d) => d.activities.length > 0)
  const toggle = (id) =>
    setOpenRouteInfo((showRouteInfo) => (showRouteInfo === id ? undefined : id)) // close if currently open

  return (
    <>
      <h3>Plan</h3>
      {driverPlanes.map((car, index) => {
        return (
          <div key={car.id}>
            <RouteTitleWrapper>
              <Elements.StrongParagraph>
                Rutt {index + 1}
              </Elements.StrongParagraph>
              <button
                margin="0"
                onClick={() => {
                  toggle(car.id)
                  history.push('/')
                }}
              >
                <Icons.Arrow />
              </button>
            </RouteTitleWrapper>

            {showRouteInfo === car.id && (
              <>
                <Elements.FlexRowWrapper>
                  <Elements.StrongParagraph>Fordon</Elements.StrongParagraph>
                  <Elements.RoundedLink
                    margin="0 0.5rem"
                    to={`/details?type=car&id=${car.id}`}
                  >
                    {car.id}
                  </Elements.RoundedLink>
                </Elements.FlexRowWrapper>
                <RouteActivities car={car} />
              </>
            )}
          </div>
        )
      })}
    </>
  )
}

export default Plan
