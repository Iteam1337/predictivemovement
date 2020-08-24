import styled from 'styled-components'
import { Link } from 'react-router-dom'

const RoundedLink = styled(Link)<{ margin: string }>`
  background: #e6ffe6;
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
    background: #ccffcc;
  }
  margin: ${({ margin }) => margin && margin};
`

export default { RoundedLink }
