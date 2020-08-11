import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import MaterialCheckbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import clockIcon from '../assets/schedule-24px.svg'

const Container = styled.div`
  margin-bottom: 2rem;
`

const CheckboxLabel = styled.span`
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
`

const InputContainer = styled.div`
  margin-bottom: 1rem;
`

const InputInnerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

const StyledAddFormFieldButton = styled.button`
  color: #666666;
  border: none;
  outline: none;
  background: transparent;
  font-weight: bold;
  padding: 0;
  font-size: ${({ size }) => size || '1rem'};
`

const AddFormFieldButton = ({ onClickHandler, children }) => (
  <StyledAddFormFieldButton type="button" onClick={onClickHandler}>
    {children}
  </StyledAddFormFieldButton>
)

const SmallInfo = styled.p`
  font-style: italic;
  font-size: 0.75rem;
  margin-top: 0;
  margin-bottom: 0.25rem;
`

const TextInput = styled.input`
  border: none;
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.875rem;
  padding: ${({ iconInset }) =>
    iconInset ? '0.75rem 0 0.75rem 2.5rem' : '0.75rem'};
`

const Label = styled.label`
  margin-bottom: 0.25rem;
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Checkbox = ({ label, checked, onChangeHandler }) => (
  <FormControlLabel
    control={
      <MaterialCheckbox
        checked={checked}
        onChange={onChangeHandler}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    }
    value="top"
    label={<CheckboxLabel>{label}</CheckboxLabel>}
    labelPlacement="end"
  />
)

const SubmitButton = styled.button`
  padding: 0.75rem 2.3rem;
  background: #ccffcc;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;

  :hover {
    background: #ccffcc;
    color: #666666;
  }
`
const CancelButton = styled.button`
  padding: 0.75rem 2.3rem;
  background: #fff;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: 1px solid #c4c4c4;
  cursor: pointer;

  :hover {
    color: #666666;
  }
`

const FormInputIcon = styled.img`
  width: 16px;
  height: 18px;
  position: absolute;
  top: 11px;
  left: 12.5px;
`

const StrongParagraph = styled.label`
  margin-bottom: 0.5rem;
  display: block;
  font-weight: bold;
`

const NavIconLink = styled(Link)`
  margin-bottom: 5rem;
`

// eslint-disable-next-line react/display-name
const TimeRestrictionDateInput = React.forwardRef(
  ({ onChange, onClick, value }, ref) => (
    <InputContainer>
      <InputInnerContainer>
        <FormInputIcon alt="Time restriction icon" src={`${clockIcon}`} />
        <TextInput
          iconInset
          onChange={onChange}
          onClick={onClick}
          value={value}
          ref={ref}
          placeholder="T.ex 2020-11-12 13:00"
          required
        />
      </InputInnerContainer>
    </InputContainer>
  )
)

export default {
  StrongParagraph,
  Container,
  TimeRestrictionDateInput,
  InputContainer,
  InputInnerContainer,
  TextInput,
  Label,
  ButtonWrapper,
  SubmitButton,
  CancelButton,
  FormInputIcon,
  CheckboxLabel,
  NavIconLink,
  AddFormFieldButton,
  SmallInfo,
  Checkbox,
}
