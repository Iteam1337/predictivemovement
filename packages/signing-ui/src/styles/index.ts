import { Field } from 'formik'
import styled from 'styled-components'
// Layout
const InputInnerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

const FormInputIcon = styled.img`
  width: 16px;
  height: 18px;
  position: absolute;
  top: 11px;
  left: 12.5px;
`

const MarginTopContainerSm = styled.div`
  margin-top: 1rem;
`

const MarginTopContainer = styled.div<{
  alignItems?: string
  marginTop?: string
}>`
  margin-top: ${({ marginTop }) => marginTop || '2rem'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: ${({ alignItems }) => alignItems && alignItems};
`
// Typeography
const BoldParagraph = styled.p`
  font-weight: bold;
`

const InfoSm = styled.p`
  font-style: italic;
  font-size: 0.75rem;
  margin-top: 0;
  margin-bottom: 0.25rem;
`

const ErrorMessage = styled(InfoSm)`
  color: red;
  margin-top: 0.25rem;
`

const TextInput = styled(Field)<{ iconinset?: boolean }>`
  border: none;
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.875rem;
  padding: ${({ iconinset }) =>
    iconinset ? '0.75rem 0 0.75rem 2.5rem' : '0.75rem'};

  :focus {
    outline-color: #13c57b;
  }
`

// Buttons
const SubmitButton = styled.button`
  background: #ccffcc;
  font-weight: 600;
  color: #666666;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  padding: 0.75rem 2.3rem;
  width: 150px;

  :hover {
    background: #c1f5c1;
  }

  :focus {
    outline-color: #ccffcc;
  }

  :disabled {
    opacity: 0.3;
  }
`

const CancelButton = styled.button`
  padding: 0.75rem 2.3rem;
  background: #ffcdcd;
  font-weight: 600;
  color: #666666;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  width: 150px;

  :hover {
    background: #ffb9b9;
  }

  :focus {
    outline-color: #ffcdcd;
  }
`

export {
  FormInputIcon,
  SubmitButton,
  CancelButton,
  MarginTopContainer,
  ErrorMessage,
  InputInnerContainer,
  BoldParagraph,
  MarginTopContainerSm,
  TextInput,
}
