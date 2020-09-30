import styled from 'styled-components'
import { Link } from 'react-router-dom'

const RoundedLink = styled(Link)<{ margin?: string; color?: string }>`
  background: ${({ color }) => color ?? '#e6ffe6'};
  opacity: 1;
  border-radius: 0.75rem;
  padding: 0.5rem 0.6rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  width: fit-content;
  color: black;
  :visited {
    color: black;
  }
  :hover {
    opacity: 0.9;
  }
  margin: ${({ margin }) => margin && margin};
`

export default { RoundedLink }
