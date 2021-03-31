import React from 'react'
import { useParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'
import SuccessScreen from './SuccessScreen'
import { Formik } from 'formik'
import SignForm from './Form'
import { Booking } from '../types/booking'
import { SignParcelValues } from '../types/signature'

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
  onSubmit: (args: SignParcelValues) => void
  bookings: Booking[] | undefined
}> = ({ onSubmit, bookings }) => {
  const [isFinished, setIsFinished] = React.useState<boolean>(false)
  const nodeRef = React.useRef<SignatureCanvas>(null)
  const params = useParams<{ bookingId?: string; transportId?: string }>()
  const booking = bookings?.find((b) => b.id === params.bookingId)

  const handleOnSubmit = (values: any, actions: any) => {
    const signatureAsBase64 = nodeRef?.current?.getTrimmedCanvas().toDataURL()
    console.log({ values, actions })

    if (params.transportId && params.bookingId) {
      onSubmit({
        type: 'signature',
        bookingId: params.bookingId,
        transportId: params.transportId,
        signature: values.signature,
        signedBy: values.signedBy,
        createdAt: new Date(),
      })
      setIsFinished(true)
    }
    actions.setSubmitting(false)
  }

  if (isFinished) {
    return (
      <SuccessScreen
        infoText={'Signering klar! Du kan nu stänga detta fönster.'}
      />
    )
  }
  const hasBookings = Boolean(bookings?.length)

  return (
    <Container>
      {!hasBookings && <Loading />}
      {hasBookings && !booking && <BookingNotFound />}
      {hasBookings && booking && (
        <>
          <Formik
            onSubmit={handleOnSubmit}
            initialValues={{ signedBy: '', signature: '' }}
          >
            <SignForm recipientName={booking?.metadata?.recipient?.name} />
          </Formik>
        </>
      )}
    </Container>
  )
}

export default Component
