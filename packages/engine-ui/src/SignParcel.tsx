import React from 'react'
import { useParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'
import * as Elements from './shared-elements/'

const Container = styled.div`
  padding: 1.875rem;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  gap: 1.875rem;
  max-width: 500px;
`

const CanvasContainer = styled.div`
  background: white;
  width: 450px;
  height: 200px;
  border: 2px dashed grey;
  @media (max-width: 640px) {
    width: 350px;
  }
`

const ButtonContainer = styled.div`
  max-width: 450px;
  width: 100%;
  display: flex;
  gap: 0.875rem;
  @media (max-width: 640px) {
    width: 350px;
  }
`

const Component: React.FC<{
  onSubmit: (base64Signature: string) => void
}> = ({ onSubmit }) => {
  const nodeRef = React.useRef<SignatureCanvas>(null)
  const params = useParams<{ t?: string; b?: string }>()
  console.log('tis is params:', params)
  const clear = () => nodeRef?.current?.clear()

  const confirm = () => {
    const signatureAsBase64 = nodeRef?.current?.getTrimmedCanvas().toDataURL()
    if (!nodeRef.current?.isEmpty() && signatureAsBase64)
      onSubmit(signatureAsBase64)
  }

  return (
    <Container>
      <div>
        <Elements.Typography.BoldParagraph>
          Rita din signatur i rutan.
        </Elements.Typography.BoldParagraph>
        <CanvasContainer>
          <SignatureCanvas
            ref={nodeRef}
            penColor="black"
            canvasProps={{
              className: 'signature_canvas',
            }}
          />
        </CanvasContainer>
      </div>
      <ButtonContainer>
        <Elements.Buttons.CancelButton
          onClick={clear}
          color="#666666"
          width="150px"
        >
          Rensa
        </Elements.Buttons.CancelButton>
        <Elements.Buttons.SubmitButton
          onClick={confirm}
          color="#666666"
          width="150px "
        >
          Bekräfta
        </Elements.Buttons.SubmitButton>
      </ButtonContainer>
    </Container>
  )
}

export default Component
