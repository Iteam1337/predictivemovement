import React from 'react'
import { useParams } from 'react-router-dom'
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
  max-width: 400px;
  input {
    max-width: 300px;
  }
`

export interface SignFormState {
  signedBy: string
  receipt: {
    base64Signature: string
  }
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

const SignParcel = ({
  onSubmit,
  bookings,
}: {
  onSubmit: ({}: SignParcelValues) => void
  bookings: Booking[] | undefined
}) => {
  const [isFinished, setIsFinished] = React.useState<boolean>(false)
  const params = useParams<{ bookingId?: string; transportId?: string }>()
  const booking = bookings?.find((b) => b.id === params.bookingId)

  const handleOnSubmit = (values: any, actions: any) => {
    if (params.transportId && params.bookingId) {
      onSubmit({
        ...values,
        type: 'signature',
        bookingId: params.bookingId,
        transportId: params.transportId,
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
            initialValues={{
              signedBy: '',
              receipt: {
                base64Signature: '',
              },
            }}
          >
            <SignForm recipientName={booking?.metadata?.recipient?.name} />
          </Formik>
        </>
      )}
    </Container>
  )
}

export default SignParcel
