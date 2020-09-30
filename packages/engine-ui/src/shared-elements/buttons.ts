import styled from 'styled-components'

const SubmitButton = styled.button<{
  justifySelf?: string
  marginTop?: string
  padding?: string
  width?: string
}>`
  background: #ccffcc;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  justify-self: ${({ justifySelf }) => justifySelf && justifySelf};
  margin-top: ${({ marginTop }) => marginTop && marginTop};
  padding: ${({ padding }) => padding || '0.75rem 2.3rem'};
  width: ${({ width }) => width && width};

  :hover {
    background: #c1f5c1;
  }

  :focus {
    outline-color: #ccffcc;
  }
`

const CancelButton = styled.button<{ padding?: string }>`
  padding: ${({ padding }) => padding || '0.75rem 2.3rem'};
  background: #fff;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: 1px solid #c4c4c4;
  cursor: pointer;
  width: fit-content;

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
  font-size: ${({ size }) => size || '1rem'};
  margin-top: ${({ marginTop }) => marginTop};
`

const DisplayTextButton = styled.button``

export default {
  SubmitButton,
  CancelButton,
  StyledAddFormFieldButton,
  DisplayTextButton,
}
