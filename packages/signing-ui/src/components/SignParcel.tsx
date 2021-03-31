import React from 'react'
import { useParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'
// import * as Elements from './shared-elements/'
// import * as stores from './utils/state/stores'
import SuccessScreen from './SuccessScreen'
import { Formik } from 'formik'
import SignForm from './Form'

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  max-width: 500px;
  input {
    max-width: 300px;
  }
`

export interface SignFormState {
  signedBy: string
  signature: string
}

const CanvasContainer = styled.div`
  background: white;
  height: 200px;
  border: 2px dashed black;
  border-radius: 10px;
  width: 99.9%;
  display: flex;

  @media only screen and (max-device-height: 380px) {
    height: 150px;
  }
  @media only screen and (max-device-height: 320px) {
    height: 100px;
  }
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
  //   const bookings = stores.dataState((state) => state.bookings)
  const [showWarningText, setShowWarningText] = React.useState(false)
  //   const booking = bookings.find((b) => b.id === params.bookingId)

  //   React.useEffect(() => {
  //     if (booking?.metadata?.recipient?.name) {
  //       setSignedBy(booking.metadata.recipient.name)
  //     }
  //   }, [booking])

  const handleOnSubmit = (values: any, actions: any) => {
    const signatureAsBase64 = nodeRef?.current?.getTrimmedCanvas().toDataURL()
    setShowWarningText(true)
    console.log({ values, actions })
    actions.setSubmitting(false)
    // return setIsFinished(true)
    // if (
    //   !nodeRef.current?.isEmpty() &&
    //   signatureAsBase64 &&
    //   params.transportId &&
    //   params.bookingId &&
    //   signedBy
    // ) {
    //   //   onSubmit(
    //   //     'signature',
    //   //     params.bookingId,
    //   //     params.transportId,
    //   //     signatureAsBase64,
    //   //     signedBy,
    //   //     new Date()
    //   //   )
    //   //   setIsFinished(true)
    // }
  }

  if (isFinished) {
    return (
      <SuccessScreen
        infoText={'Signering klar! Du kan nu stänga detta fönster.'}
      />
    )
  }
  //   const hasBookings = Boolean(bookings.length)

  return (
    <Container>
      {/* {!hasBookings && <Loading />}
      {hasBookings && !booking && <BookingNotFound />}
      {hasBookings && booking && ( */}
      <>
        <Formik
          onSubmit={handleOnSubmit}
          initialValues={{ signedBy: '', signature: '' }}
        >
          <SignForm />
        </Formik>
      </>
      {/* )} */}
    </Container>
  )
}

export default Component
