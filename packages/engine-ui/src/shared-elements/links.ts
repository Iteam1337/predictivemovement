import styled from 'styled-components'
import { Link } from 'react-router-dom'

const LinkWithDot = styled(Link)<{ dotColor: string }>`
  ${({ dotColor }) =>
    dotColor &&
    `
  &::before {
    border-radius: 50%;
    background-color: ${dotColor};
    width: 12px;
    height: 12px;
    display: inline-block;
    content: '';
    margin-right: 5px;
  }`}

  opacity: 1;
  padding: 0.5rem 0.6rem;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
  width: fit-content;
  color: black;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.1rem;

  :hover {
    opacity: 0.8;
  }
`

const PlaneLink = styled(Link)`
  text-decoration: none;
  opacity: 1;
  color: #666666;
  padding: 1rem 0.6rem;
  display: block;
  font-weight: bold;

  :hover {
    opacity: 0.9;
  }
`

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
  margin: ${({ margin }) => margin && margin};
  :visited {
    color: black;
  }
  :hover {
    opacity: 0.9;
    background: ${({ hoverbackground }) => hoverbackground};
  }
`

export { RoundedLink, LinkWithDot, PlaneLink }
