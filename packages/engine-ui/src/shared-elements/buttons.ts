import styled from 'styled-components'

const SubmitButton = styled.button<{
  alignSelf?: string
  justifySelf?: string
  marginTop?: string
  padding?: string
  width?: string
  color?: string
}>`
  background: #ccffcc;
  font-weight: 600;
  color: ${({ color }) => color || 'inherit'};
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  justify-self: ${({ justifySelf }) => justifySelf && justifySelf};
  align-self: ${({ alignSelf }) => alignSelf && alignSelf};
  margin-top: ${({ marginTop }) => marginTop && marginTop};
  padding: ${({ padding }) => padding || '0.75rem 2.3rem'};
  width: ${({ width }) => (width ? width : 'fit-content')};

  :hover {
    background: #c1f5c1;
  }

  :focus {
    outline-color: #ccffcc;
  }
`

const CancelButton = styled.button<{ padding?: string, width?: string, marginTop?: string }>`
  padding: ${({ padding }) => padding || '0.75rem 2.3rem'};
  background: #fff;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: 1px solid #c4c4c4;
  cursor: pointer;
  width: ${({ width }) => (width ? width : 'fit-content')};
  margin-top: ${({ marginTop }) => marginTop && marginTop};

  :hover {
    color: #666666;
  }

  :focus {
    outline-color: #666666;
  }
`

const StyledAddFormFieldButton = styled.button<{
  size?: string
  marginTop: string
}>`
  color: #666666;
  border: none;
  outline: none;
  background: transparent;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  font-size: ${({ size }) => size || '1rem'};
  margin-top: ${({ marginTop }) => marginTop};
`

const DisplayTextButton = styled.button``

export {
  SubmitButton,
  CancelButton,
  StyledAddFormFieldButton,
  DisplayTextButton,
}
