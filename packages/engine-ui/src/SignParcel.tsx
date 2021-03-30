import React from 'react'
import { useParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'
import * as Elements from './shared-elements/'
import * as stores from './utils/state/stores'
import SuccessScreen from './components/SuccessScreen'
import nameIcon from './assets/contact-name.svg'

const TextInput = styled.input<{ iconinset?: boolean }>`
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
const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  max-width: 500px;
  margin-top: 10rem;
  input {
    max-width: 300px;
  }

  @media (max-width: 768px) {
    margin-top: 0;
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    margin: 0;
  }

  @media only screen and (device-width: 812px) and (device-height: 375px) and (-webkit-device-pixel-ratio: 3) {
    margin: 0;
  }
`

const CanvasContainer = styled.div`
  background: white;
  height: 200px;
  border: 2px dashed black;
  border-radius: 10px;
  width: 99.9%;
  display: flex;
`

const ButtonContainer = styled.div`
  max-width: 300px;
  width: 100%;
  display: flex;
  button:first-of-type {
    margin-right: 1rem;
  }
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
    type: string,
    bookingId: string,
    transportId: string,
    base64Signature: string,
    signedBy: string,
    createdAt: Date
  ) => void
}> = ({ onSubmit }) => {
  const [signedBy, setSignedBy] = React.useState<string>('')
  const [isFinished, setIsFinished] = React.useState<boolean>(false)
  const [hasDrawn, setHasDrawn] = React.useState<boolean>(false)
  const nodeRef = React.useRef<SignatureCanvas>(null)
  const params = useParams<{ bookingId?: string; transportId?: string }>()
  const bookings = stores.dataState((state) => state.bookings)
  const [showWarningText, setShowWarningText] = React.useState(false)
  const booking = bookings.find((b) => b.id === params.bookingId)

  React.useEffect(() => {
    if (booking?.metadata?.recipient?.name) {
      setSignedBy(booking.metadata.recipient.name)
    }
  }, [booking])

  const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSignedBy(event.target.value)

  const onDrawEnd = () => setHasDrawn(true)

  const clear = () => {
    nodeRef?.current?.clear()
    setSignedBy('')
  }
  const confirm = () => {
    const signatureAsBase64 = nodeRef?.current?.getTrimmedCanvas().toDataURL()
    setShowWarningText(true)
    if (
      !nodeRef.current?.isEmpty() &&
      signatureAsBase64 &&
      params.transportId &&
      params.bookingId &&
      signedBy
    ) {
      onSubmit(
        'signature',
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
                clearOnResize={false}
                onEnd={onDrawEnd}
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
                <TextInput
                  onFocus={() => {}}
                  name="signedByName"
                  value={signedBy}
                  onChange={onTextInputChange}
                  placeholder="Namn"
                  iconinset={true}
                />
              </Elements.Layout.InputInnerContainer>
            </Elements.Layout.MarginTopContainerSm>
          </div>
          {showWarningText && (
            <Elements.Typography.ErrorMessage>
              Var god och fyll i namn och signatur
            </Elements.Typography.ErrorMessage>
          )}
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
              disabled={!hasDrawn}
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
