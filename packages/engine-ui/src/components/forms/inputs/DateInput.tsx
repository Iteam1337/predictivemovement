import React from 'react'
import Elements from '../../../shared-elements'
import styled from 'styled-components'
import arrowIcon from '../../../assets/input-arrowdown.svg'

const TimeRestrictionFormInputIcon = styled.img`
  width: 10px;
  height: 10px;
  position: absolute;
  top: 14px;
  left: 82%;
`

// eslint-disable-next-line react/display-name
const TimeRestrictionDateInput = React.forwardRef<
  {},
  {
    onChange: (event: any) => void
    onClick: (event: any) => void
    value: string
    placeholder: string
    withIcon: boolean
    handleFocus?: () => void
    isRequired: boolean
  }
>(
  (
    {
      onChange,
      onClick,
      value,
      placeholder,
      withIcon = true,
      handleFocus,
      isRequired = true,
    },
    ref
  ) => {
    return (
      <Elements.Layout.TimeRestrictionDateInputWrapper>
        <Elements.Layout.InputInnerContainer>
          {withIcon && (
            <TimeRestrictionFormInputIcon onClick={onClick} src={arrowIcon} />
          )}
          <Elements.Form.DateInput
            onFocus={() => handleFocus?.()}
            onChange={onChange}
            onClick={onClick}
            value={value}
            ref={ref as React.Ref<HTMLInputElement>}
            placeholder={placeholder}
            iconInset={withIcon}
            required={isRequired}
          />
        </Elements.Layout.InputInnerContainer>
      </Elements.Layout.TimeRestrictionDateInputWrapper>
    )
  }
)

export default TimeRestrictionDateInput
