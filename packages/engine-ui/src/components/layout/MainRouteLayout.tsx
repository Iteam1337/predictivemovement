import React from 'react'
import { useHistory } from 'react-router-dom'
import Elements from '../../shared-elements'
import Icons from '../../assets/Icons'
import styled from 'styled-components'
import AddFormFieldButton from '../forms/inputs/AddFormFieldButton'

const NestedMenuWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`

const MainRouteLayout: React.FC<{
  redirect?: string
}> = ({ children, redirect = '/' }) => {
  const history = useHistory()

  return (
    <NestedMenuWrapper>
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
      {children}
    </NestedMenuWrapper>
  )
}
export default MainRouteLayout
