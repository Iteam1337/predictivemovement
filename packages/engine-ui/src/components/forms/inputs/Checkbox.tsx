import React from 'react'
import styled from 'styled-components'

const CustomCheckboxContainer = styled.label`
  position: relative;
  margin: 0.5rem 0 0.5rem 0;
  height: 20px;
  display: block;
  .custom-checkbox {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 18px;
    width: 18px;
    background-color: #f1f3f5;
    border-radius: 3px;
    border: 2px solid #666666;
    transition: all 50ms ease;
  }

  .custom-checkbox::after {
    position: absolute;
    content: '';
    left: 4px;
    top: 0px;
    height: 0;
    width: 0;
    border-radius: 3px;
    border: solid black;
    border-width: 0 2px 2px 0;
    transform: rotate(0deg) scale(0);
    opacity: 1;
    transition: all 50ms ease;
  }

  input:checked ~ .custom-checkbox {
    background-color: #666666;
    border-radius: 3px;
    transform: rotate(0deg) scale(1);
    opacity: 1;
    border: 2px solid #666666;
  }
  
  input:focus ~ .custom-checkbox {
    border: 2px solid #13c57b;
  }

  input:active ~ .custom-checkbox {
    transform: rotate(0deg) scale(0.95);
    opacity: 1;
  }

  input:checked ~ .custom-checkbox::after {
    transform: rotate(45deg) scale(1);
    opacity: 1;
    left: 4px;
    top: 0px;
    width: 3px;
    height: 9px;
    border: solid white;
    border-width: 0 3px 3px 0;
    background-color: transparent;
    border-radius: 0;
  }
`

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`

const CheckboxLabel = styled.label`
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
  margin-left: 24px;
`

const Checkbox: React.FC<{
  name: string
  onChangeHandler: (event: any) => void
  label: string
}> = ({ name, onChangeHandler, label }) => {
  return (
    <CustomCheckboxContainer>
      <HiddenCheckbox name={name} type="checkbox" onChange={onChangeHandler} />
      <CheckboxLabel>{label}</CheckboxLabel>
      <span className="custom-checkbox" />
    </CustomCheckboxContainer>
  )
}

export default Checkbox
