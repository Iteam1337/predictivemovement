import React from 'react'
import SharedElements from '../../../shared-elements'

export const AddFormFieldButton = ({
  onClickHandler,
  children,
  marginTop = '5rem',
}) => (
  <SharedElements.Buttons.StyledAddFormFieldButton
    type="button"
    onClick={onClickHandler}
    marginTop={marginTop}
  >
    {children}
  </SharedElements.Buttons.StyledAddFormFieldButton>
)

export default AddFormFieldButton
