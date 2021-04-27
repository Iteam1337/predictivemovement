import React from 'react'
import { useHistory } from 'react-router-dom'
import * as Elements from '../../shared-elements'
import * as Icons from '../../assets/Icons'
import styled from 'styled-components'
import AddFormFieldButton from '../forms/inputs/AddFormFieldButton'

const NestedMenuWrapper = styled.div<{ isMobile: boolean }>`
  display: grid;
  ${({ isMobile }) => !isMobile && 'grid-template-columns: auto 1fr'};
`

const MainRouteLayout: React.FC<{
  redirect?: string
}> = ({ children, redirect = '/' }) => {
  const history = useHistory()
  const isMobile = window.innerWidth <= 645

  return (
    <NestedMenuWrapper isMobile={isMobile}>
      {!isMobile && (
        <Elements.Layout.FlexRowWrapper style={{ margin: '1.25em 0' }}>
          <AddFormFieldButton
            marginTop="0"
            onClickHandler={() => {
              if (history.length > 2) {
                return history.goBack()
              }

              return history.push(redirect)
            }}
          >
            <Icons.Arrow style={{ transform: 'rotate(90deg)' }} />
          </AddFormFieldButton>
        </Elements.Layout.FlexRowWrapper>
      )}
      {children}
    </NestedMenuWrapper>
  )
}
export default MainRouteLayout
