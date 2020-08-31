import React from 'react'
import { Link } from 'react-router-dom'
import Elements from '../../shared-elements'
import Icons from '../../assets/Icons'
import styled from 'styled-components'
import { ViewportContext, DRC_MAP } from '../../utils/ViewportContext'

const NestedMenuWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`
const NestedMenu: React.FC = ({ children }) => {
  const { setViewport } = React.useContext(ViewportContext)
  return (
    <NestedMenuWrapper>
      <Elements.Layout.FlexRowWrapper style={{ margin: '1.2em 0' }}>
        <Link to="/" onClick={() => setViewport(DRC_MAP)}>
          <Icons.Arrow style={{ transform: 'rotate(90deg)' }} />
        </Link>
      </Elements.Layout.FlexRowWrapper>
      {children}
    </NestedMenuWrapper>
  )
}
export default NestedMenu
