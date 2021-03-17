import styled from 'styled-components'
import { Link } from 'react-router-dom'

const RoundedLink = styled(Link)<{
  margin?: string
  color?: string
  hoverbackground?: string
}>`
  background: ${({ color }) => color ?? '#e6ffe6'};
  opacity: 1;
  border-radius: 0.75rem;
  padding: 0.5rem 0.6rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  width: fit-content;
  color: black;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.1rem;
  :visited {
    color: black;
  }
  :hover {
    opacity: 0.9;
    background: ${({ hoverbackground }) => hoverbackground};
  }
  margin: ${({ margin }) => margin && margin};
`

export { RoundedLink }
