import React from 'react'

import { useHistory } from 'react-router-dom'
import * as Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import 'react-datepicker/dist/react-datepicker.css'
import MainRouteLayout from './layout/MainRouteLayout'
import Success from './SuccessScreen'
import * as stores from '../utils/state/stores'
import { Formik, FormikHelpers } from 'formik'
export interface BookingFormState {
  externalId: string
  pickup: {
    name: string
    lat: string
    lon: string
    timeWindows:
      | {
          earliest: Date
          latest: Date
        }[]
      | null
    street: string
    city: string
  }
  delivery: {
    name: string
    lat: string
    lon: string
    timeWindows:
      | {
          earliest: Date
          latest: Date
        }[]
      | null
    street: string
    city: string
  }
  metadata: {
    customer: string
    cargo: string
    fragile: boolean
    recipient: { name: string; contact: string; info: string }
    sender: { name: string; contact: string; info: string }
  }
  size: { weight: number; measurements: string }
}
const parcelSizePresets = {
  small: { weight: 1, measurements: '18x18x18' },
  medium: { weight: 10, measurements: '24x24x24' },
  big: { weight: 50, measurements: '36x36x36' },
}

export const initialState: BookingFormState = {
  externalId: '',
  pickup: {
    name: '',
    lat: '',
    lon: '',
    timeWindows: null,
    street: '',
    city: '',
  },
  delivery: {
    name: '',
    lat: '',
    lon: '',
    street: '',
    city: '',
    timeWindows: null,
  },
  metadata: {
    customer: '',
    cargo: '',
    fragile: false,
    recipient: { name: '', contact: '', info: '' },
    sender: { name: '', contact: '', info: '' },
  },
  size: parcelSizePresets.small,
}

const CreateBooking = ({ onSubmit }: { onSubmit: (params: any) => void }) => {
  const history = useHistory()
  const [isFinished, setIsFinished] = React.useState(false)
  const setUIState = stores.ui((state) => state.dispatch)

  const onSubmitHandler = (
    values: BookingFormState,
    actions: FormikHelpers<BookingFormState>
  ) => {
    onSubmit({
      ...values,
      size: {
        ...values.size,
        measurements: values.size.measurements
          ? values.size.measurements.split('x').map(parseFloat)
          : null,
        weight: values.size.weight || 0,
      },
    })

    actions.setSubmitting(false)
    return setIsFinished(true)
  }

  const handleOnContinue = () => {
    setIsFinished(false)
  }

  const handleOnClose = () => history.push('/bookings')

  if (isFinished)
    return (
      <Success
        onClose={handleOnClose}
        onContinue={handleOnContinue}
        infoText="Bokningen är nu tillagd!"
      />
    )

  return (
    <MainRouteLayout redirect="/bookings">
      <Elements.Layout.Container>
        <h3>Lägg till bokning</h3>
        <Formik initialValues={initialState} onSubmit={onSubmitHandler}>
          <Form dispatch={setUIState} parcelSizePresets={parcelSizePresets} />
        </Formik>
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}
export default CreateBooking
