import React from 'react'
import * as Elements from '../../../shared-elements'

const Component = ({
  value,
  onChangeHandler,
  placeholder,
  name,
  type = 'text',
  ...rest
}) => (
  <Elements.Form.TextInput
    {...rest}
    type={type}
    value={value}
    onChange={onChangeHandler}
    onClick={onChangeHandler}
    placeholder={placeholder}
    name={name}
  />
)

export default Component
