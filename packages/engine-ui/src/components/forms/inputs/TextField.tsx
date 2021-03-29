import React from 'react'
import * as Elements from '../../../shared-elements'

interface TextInputProps {
  [key: string]: any
  placeholder: string
  name: string
  type?: string
  validate?: (value: string) => string | undefined
}

const Component: React.FC<TextInputProps> = ({
  placeholder,
  name,
  type = 'text',
  validate,
  ...rest
}) => (
  <Elements.Form.TextField
    {...rest}
    type={type}
    placeholder={placeholder}
    name={name}
    validate={validate}
  />
)

export default Component
