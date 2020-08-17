import React from 'react'
import styled from 'styled-components'

const Svg = styled.svg`
  transform: ${({ active }) => (active ? 'none' : 'rotate(180deg)')};
  width: 11px;
  height: 8px;
  fill: none;
`
const Arrow = ({ active }) => (
  <Svg active={active} viewBox="0 0 11 8">
    <path
      d="M5.469 7.031a.736.736 0 001.031 0l4.25-4.25c.313-.312.313-.781 0-1.062L10.062 1C9.75.719 9.283.719 9 1L5.969 4.031 2.969 1c-.281-.281-.75-.281-1.063 0l-.687.719c-.313.281-.313.75 0 1.062l4.25 4.25z"
      fill="#666"
    />
  </Svg>
)

export default { Arrow }
