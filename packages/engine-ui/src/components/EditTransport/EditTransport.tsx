import React from 'react'
import * as stores from '../../utils/state/stores'
import * as Elements from '../../shared-elements'
import Form from '../forms/CreateTransport'
import moment from 'moment'
import { transportPresets } from '../CreateTransport'
import { Formik, FormikHelpers } from 'formik'

export interface FormState {
  capacity: {
    volume: string
    weight: string
  }
  earliestStart: Date | null
  endAddress: {
    lat?: number
    lon?: number
    name?: string
  } | null
  id: string
  latestEnd: Date | null
  metadata: {
    fleet: string
    driver: {
      contact?: string
      name?: string
    }
    profile: string
  }
  startAddress: {
    lat: number
    lon: number
    name?: string
  }
}

const editableFields: Array<keyof FormState> = [
  'capacity',
  'earliestStart',
  'endAddress',
  'id',
  'latestEnd',
  'metadata',
  'startAddress',
]

const EditTransport = ({
  setIsFinished,
  transport,
  updateTransport,
}: {
  setIsFinished: (isFinished: boolean) => void
  transport: FormState
  updateTransport: (form: any) => void
}) => {
  const [isActive, setActive] = React.useState(false)
  const setUIState = stores.ui((state) => state.dispatch)

  React.useEffect(() => {
    setActive(true)

    return () => setActive(false)
  }, [isActive])

  const onSubmitHandler = (
    values: FormState,
    actions: FormikHelpers<FormState>
  ) => {
    const endAddress = values.endAddress || values.startAddress

    const updatedTransport = {
      ...values,
      earliestStart: values.earliestStart
        ? moment(values.earliestStart).format('HH:mm')
        : values.earliestStart,
      capacity: {
        weight: parseInt(values.capacity.weight),
        volume: parseFloat(values.capacity.volume),
      },
      latestEnd: values.latestEnd
        ? moment(values.latestEnd).format('HH:mm')
        : values.latestEnd,
      startAddress: {
        ...values.startAddress,
        name: values.startAddress.name || undefined,
      },
      endAddress: {
        ...endAddress,
        name: endAddress.name || undefined,
      },
      metadata: {
        ...values.metadata,
        driver: {
          name: values.metadata.driver.name || undefined,
          contact: values.metadata.driver.contact || undefined,
        },
      },
    }

    updateTransport(
      editableFields
        .filter(
          (key) =>
            JSON.stringify(transport[key]) !== JSON.stringify(values[key])
        )
        .reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: updatedTransport[curr],
          }),
          { id: updatedTransport.id }
        )
    )

    actions.setSubmitting(false)
    return setIsFinished(true)
  }

  return (
    <Elements.Layout.ContainerWidth>
      <h3>Uppdatera transport</h3>
      <Formik initialValues={transport} onSubmit={onSubmitHandler}>
        <Form
          type="EDIT"
          dispatch={setUIState}
          transportPresets={transportPresets}
        />
      </Formik>
    </Elements.Layout.ContainerWidth>
  )
}

export default EditTransport
