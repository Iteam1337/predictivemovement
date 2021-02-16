import React from 'react'
import { useParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'
import * as Elements from './shared-elements/'
import * as stores from './utils/state/stores'
import SuccessScreen from './components/SuccessScreen'
import nameIcon from './assets/contact-name.svg'
import * as FormInputs from './components/forms/inputs'

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  max-width: 500px;
  margin-top: 10rem;
  input {
    max-width: 300px;
  }

  @media (max-width: 640px) {
    margin-top: 0;
  }
`

const CanvasContainer = styled.div`
  background: white;
  height: 200px;
  border: 1px dashed black;
  border-radius: 10px;
  width: 99.9%;
  display: flex;
`

const ButtonContainer = styled.div`
  max-width: 300px;
  width: 100%;
  display: flex;
  gap: 0.875rem;
`
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Loading = () => {
  return (
    <LoadingContainer>
      <h2>Laddar...</h2>
    </LoadingContainer>
  )
}

const BookingNotFound = () => {
  return (
    <LoadingContainer>
      <h2>Något gick fel, vi kunde inte hitta någon bokning att signera.</h2>
    </LoadingContainer>
  )
}

const Component: React.FC<{
  onSubmit: (
    bookingId: string,
    transportId: string,
    base64Signature: string,
    signedBy: string,
    createdAt: Date
  ) => void
}> = ({ onSubmit }) => {
  const [signedBy, setSignedBy] = React.useState<string>('')
  const [isFinished, setIsFinished] = React.useState<boolean>(false)
  const nodeRef = React.useRef<SignatureCanvas>(null)
  const params = useParams<{ bookingId?: string; transportId?: string }>()
  const bookings = stores.dataState((state) => state.bookings)

  const booking = bookings.find((b) => b.id === params.bookingId)

  React.useEffect(() => {
    if (booking?.metadata?.recipient?.name) {
      setSignedBy(booking.metadata.recipient.name)
    }
  }, [booking])

  const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSignedBy(event.target.value)

  const clear = () => nodeRef?.current?.clear()
  const confirm = () => {
    const signatureAsBase64 = nodeRef?.current?.getTrimmedCanvas().toDataURL()

    if (
      !nodeRef.current?.isEmpty() &&
      signatureAsBase64 &&
      params.transportId &&
      params.bookingId &&
      signedBy
    ) {
      onSubmit(
        params.bookingId,
        params.transportId,
        signatureAsBase64,
        signedBy,
        new Date()
      )
      setIsFinished(true)
    }
  }

  if (isFinished) {
    return (
      <SuccessScreen
        infoText={'Signering klar! Du kan nu stänga detta fönster.'}
      />
    )
  }
  const hasBookings = Boolean(bookings.length)

  return (
    <Container>
      {!hasBookings && <Loading />}
      {hasBookings && !booking && <BookingNotFound />}
      {hasBookings && booking && (
        <>
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
            <Elements.Layout.MarginTopContainerSm>
              <Elements.Layout.InputInnerContainer>
                <Elements.Icons.FormInputIcon
                  alt="Contact name icon"
                  src={`${nameIcon}`}
                />
                <FormInputs.TextInput
                  onFocus={() => {}}
                  name="signedByName"
                  value={signedBy}
                  onChangeHandler={onTextInputChange}
                  placeholder="Namn"
                  iconInset
                />
              </Elements.Layout.InputInnerContainer>
            </Elements.Layout.MarginTopContainerSm>
          </div>
          <Elements.Layout.MarginTopContainer></Elements.Layout.MarginTopContainer>
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
        </>
      )}
    </Container>
  )
}

export default Component
