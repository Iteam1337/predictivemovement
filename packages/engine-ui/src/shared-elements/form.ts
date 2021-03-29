import { Field } from 'formik'
import styled from 'styled-components'

const DateInput = styled.input<{ iconinset: boolean }>`
  cursor: default;
  border: none;
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.75rem;
  padding: ${({ iconinset }) =>
    iconinset ? '0.75rem 1rem 0.75rem 0.75rem' : '0.75rem'};

  :focus {
    outline-color: #13c57b;
  }
`

const Label = styled.label<{ required?: boolean }>`
  margin-bottom: 0.25rem;
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
  ${({ required }) =>
    required &&
    `
  ::after {
    content:" *";
    color: red;
  }`}
`

const TextInput = styled(Field)<{ iconinset?: boolean; error?: boolean }>`
  border: ${({ error }) => (error ? '1px solid red' : 'none')};
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

const SelectInput = styled(Field)`
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.875rem;
  padding: 0.55rem;
  :focus {
    outline-color: #13c57b;
  }
`

const DropdownWrapper = styled.div`
  width: 100%;
  z-index: 1;
  position: absolute;
`

const DropdownButton = styled.button`
  width: inherit;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
  :focus {
    outline-color: #13c57b;
  }
  background-color: #f1f3f5;
  margin: 0;
`

export {
  DateInput,
  Label,
  TextInput,
  SelectInput,
  DropdownWrapper,
  DropdownButton,
}
