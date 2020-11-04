import React from 'react'
import * as Elements from '../../../shared-elements'

export const AddFormFieldButton = ({
  onClickHandler,
  children,
  marginTop = '5rem',
}) => (
  <Elements.Buttons.StyledAddFormFieldButton
    type="button"
    onClick={onClickHandler}
    marginTop={marginTop}
  >
    {children}
  </Elements.Buttons.StyledAddFormFieldButton>
)

export default AddFormFieldButton
