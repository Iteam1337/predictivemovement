import React from 'react'
import * as types from '../../types'
import * as Elements from '../../shared-elements'
import Form from '../forms/CreateBooking'
import * as stores from '../../utils/state/stores'
import { Formik, FormikHelpers } from 'formik'

interface Props {
  booking: types.Booking
  updateBooking: (params: any) => void
  setIsFinished: (isFinished: boolean) => void
}

export interface FormBooking extends Omit<types.Booking, 'size'> {
  [key: string]: any
  size: {
    measurements: string
    weight: number
  }
}

const parcelSizePresets = {
  small: { weight: 1, measurements: '18x18x18' },
  medium: { weight: 10, measurements: '24x24x24' },
  big: { weight: 50, measurements: '36x36x36' },
}

const EditBooking = ({ booking, updateBooking, setIsFinished }: Props) => {
  const formBooking: FormBooking = {
    ...booking,
    size: {
      weight: booking.size.weight ? booking.size.weight : 0,
      measurements: booking.size.measurements
        ? booking.size.measurements.join('x')
        : '',
    },
    pickup: {
      ...booking.pickup,
      timeWindows:
        booking.pickup.timeWindows?.map((t) => ({
          earliest: t.earliest ? new Date(t.earliest) : '',
          latest: t.latest ? new Date(t.latest) : '',
        })) || null,
    },
    delivery: {
      ...booking.delivery,
      timeWindows:
        booking.delivery.timeWindows?.map((t) => ({
          earliest: t.earliest ? new Date(t.earliest) : '',
          latest: t.latest ? new Date(t.latest) : '',
        })) || null,
    },
  }

  const setUIState = stores.ui((state) => state.dispatch)

  const onSubmitHandler = (
    values: FormBooking,
    actions: FormikHelpers<FormBooking>
  ) => {
    updateBooking({
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

  return (
    <Elements.Layout.Container>
      <h3>Uppdatera bokning</h3>
      <Formik initialValues={formBooking} onSubmit={onSubmitHandler}>
        <Form
          type="EDIT"
          dispatch={setUIState}
          parcelSizePresets={parcelSizePresets}
        />
      </Formik>
    </Elements.Layout.Container>
  )
}

export default EditBooking
