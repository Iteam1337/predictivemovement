import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import MaterialCheckbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import clockIcon from '../assets/schedule-24px.svg'

const FlexRowWrapper = styled.div`
  display: flex;
  align-items: baseline;
`

const LinkListContainer = styled.div`
  display: flex;
  flex-direction: column;

  a {
    margin-top: 0.5rem;
  }
`

const NoInfoParagraph = styled.p`
  font-style: italic;
  font-size: 0.875rem;
`

const Container = styled.div`
  margin-bottom: 2rem;
`

const CheckboxLabel = styled.span`
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
`

const InputBlock = styled.div`
  margin-bottom: 1rem;
`

const InputContainer = styled.div`
  margin-bottom: 0.5rem;
`

const InputInnerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

const RoundedLink = styled(Link)`
  background: #e6ffe6;
  border-radius: 0.75rem;
  padding: 0.5rem 0.6rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  width: fit-content;
  color: black;
  :visited {
    color: black;
  }
  :hover {
    background: #ccffcc;
  }
  margin: ${({ margin }) => margin && margin};
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

const DateInput = styled.input`
  border: none;
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.75rem;
  padding: ${({ iconInset }) =>
    iconInset ? '0.5rem 0 0.5rem 2rem' : '0.5rem'};
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
  margin-top: 2rem;
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

const TextInputPairContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const TextInputPairItem = styled.div`
  width: 48.5%;
`

const SubmitButton = styled.button`
  padding: 0.75rem 2.3rem;
  background: #ccffcc;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  justify-self: ${({ justifySelf }) => justifySelf && justifySelf};

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

const DateInputIcon = styled.img`
  width: 16px;
  height: 18px;
  position: absolute;
  top: 6px;
  left: 10px;
`

const StrongParagraph = styled.label`
  margin: 1rem 0;
  display: block;
  font-weight: bold;
`

const NavIconLink = styled(Link)`
  margin-bottom: 5rem;
`
const TimeRestrictionDateInputWrapper = styled.div`
  margin-bottom: 0.25rem;
`

// eslint-disable-next-line react/display-name
const TimeRestrictionDateInput = React.forwardRef(
  ({ onChange, onClick, value, placeholder, withIcon = true }, ref) => {
    return (
      <TimeRestrictionDateInputWrapper>
        <InputInnerContainer>
          {withIcon && (
            <DateInputIcon alt="Time restriction icon" src={`${clockIcon}`} />
          )}

          <DateInput
            iconInset={withIcon}
            onChange={onChange}
            onClick={onClick}
            value={value}
            ref={ref}
            placeholder={placeholder}
            required
          />
        </InputInnerContainer>
      </TimeRestrictionDateInputWrapper>
    )
  }
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
  FlexRowWrapper,
  RoundedLink,
  LinkListContainer,
  NoInfoParagraph,
  FormInputIcon,
  CheckboxLabel,
  NavIconLink,
  AddFormFieldButton,
  SmallInfo,
  Checkbox,
  TextInputPairContainer,
  TextInputPairItem,
  InputBlock,
}
