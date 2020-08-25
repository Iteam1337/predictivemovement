import styled from 'styled-components'

const SubmitButton = styled.button<{ justifySelf: string }>`
  padding: 0.75rem 2.3rem;
  background: #ccffcc;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  justify-self: ${({ justifySelf }) => justifySelf && justifySelf};

  :hover {
    background: #c1f5c1;
  }

  :focus {
    outline-color: #ccffcc;
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

  :focus {
    outline-color: #666666;
  }
`

export default { SubmitButton, CancelButton }
