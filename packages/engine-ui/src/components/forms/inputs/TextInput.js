import React from 'react'
import Elements from '../../Elements'

const Component = ({
  value,
  onChangeHandler,
  placeholder,
  name,
  type = 'text',
  ...rest
}) => (
  <Elements.TextInput
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
