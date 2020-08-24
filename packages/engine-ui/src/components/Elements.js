import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const FlexRowWrapper = styled.div`
  display: flex;
  align-items: baseline;
`

const LinkListContainer = styled.div`
  a:not(:first-child) {
    margin-top: 0.5rem;
  }
  display: flex;
  flex-direction: column;
`

const NoInfoParagraph = styled.p`
  font-style: italic;
  font-size: 0.875rem;
`

const Container = styled.div`
  margin-bottom: 2rem;
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

const TextInputWithArrow = styled(TextInput)`
  padding: ${({ iconInset }) =>
    iconInset ? '0.75rem 0 0.75rem 1.1rem' : '0.75rem'};
`

const DateInput = styled.input`
  cursor: default;
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
  margin-top: 2rem;
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

const Checkbox = ({ name, onChangeHandler, label }) => {
  return (
    <CustomCheckboxContainer>
      <HiddenCheckbox name={name} type="checkbox" onChange={onChangeHandler} />
      <CheckboxLabel>{label}</CheckboxLabel>
      <span className="custom-checkbox" />
    </CustomCheckboxContainer>
  )
}

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

const StrongParagraph = styled.label`
  margin-bottom: 0.5rem;
  display: block;
  font-weight: bold;
`

const NavIconLink = styled(Link)`
  margin-bottom: 5rem;
`
const TimeRestrictionDateInputWrapper = styled.div`
  margin-bottom: 0.25rem;
`

const TimeRestrictionWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`

// eslint-disable-next-line react/display-name
const TimeRestrictionDateInput = React.forwardRef(
  ({ onChange, onClick, value, placeholder }, ref) => {
    return (
      <TimeRestrictionDateInputWrapper>
        <InputInnerContainer>
          <DateInput
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
  TimeRestrictionWrapper,
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
  TextInputWithArrow,
}
