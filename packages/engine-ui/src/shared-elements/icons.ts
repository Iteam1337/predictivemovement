import styled from 'styled-components'
import * as Icons from '../assets/Icons'

const FormInputIcon = styled.img`
  width: 16px;
  height: 18px;
  position: absolute;
  top: 11px;
  left: 12.5px;
`

const MarginRightIcon = styled.img`
  margin-right: 0.5rem;
`

const Chevron = styled(Icons.ListArrow)<{ active: string }>`
  transform: ${({ active }) => active === 'true' && `rotate(90deg)`};
  transition: transform 0.2s;
  margin-right: 0.875rem;
`

export { FormInputIcon, MarginRightIcon, Chevron }
