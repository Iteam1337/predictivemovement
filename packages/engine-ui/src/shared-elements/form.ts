import styled from 'styled-components'

const DateInput = styled.input<{ iconInset: boolean }>`
  cursor: default;
  border: none;
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.75rem;
  padding: ${({ iconInset }) =>
    iconInset ? '0.75rem 1rem 0.75rem 0.75rem' : '0.75rem'};

  :focus {
    outline-color: #13c57b;
  }
`

const Label = styled.label`
  margin-bottom: 0.25rem;
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
`

export default { DateInput, Label }
