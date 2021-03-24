import { useHistory, useParams } from 'react-router-dom'
import * as Elements from '../shared-elements'
import Form from './forms/CreateTransport'
import MainRouteLayout from './layout/MainRouteLayout'
import Success from './SuccessScreen'
import moment from 'moment'
import * as stores from '../utils/state/stores'
import React from 'react'
import { Formik, FormikHelpers } from 'formik'

export const transportPresets = {
  small: { weight: '1234', volume: '18' },
  medium: { weight: '2234', volume: '24' },
  big: { weight: '4234', volume: '36' },
}

const initialState: FormState = {
  id: '',
  capacity: transportPresets.small,
  earliestStart: null,
  latestEnd: null,
  startAddress: { lat: 61.8172594, lon: 16.0561472, name: '' },
  endAddress: { lat: 61.8172594, lon: 16.0561472, name: '' },
  metadata: {
    fleet: '',
    profile: '',
    driver: {
      contact: '',
      name: '',
    },
  },
}

export interface FormState {
  [key: string]: any
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
    profile: string
    driver: {
      contact?: string
      name?: string
    }
  }
  startAddress: {
    lat: number
    lon: number
    name?: string
  }
}

interface FormSubmit extends Omit<FormState, 'capacity'> {
  capacity: {
    volume: number
    weight: number
  }
}

const CreateTransport = ({
  onSubmit,
}: {
  onSubmit: (form: FormSubmit) => void
}) => {
  const history = useHistory()
  const [isActive, setActive] = React.useState(false)
  const [isFinished, setIsFinished] = React.useState(false)
  const [formState, setState] = React.useState(initialState)
  const setUIState = stores.ui((state) => state.dispatch)

  const { fleet } = useParams<{ fleet: string | undefined }>()

  React.useEffect(() => {
    if (fleet) {
      setState((current) => ({
        ...current,
        metadata: { ...current.metadata, fleet },
      }))
    }
  }, [fleet])

  React.useEffect(() => {
    setActive(true)

    return () => setActive(false)
  }, [isActive])

  const onSubmitHandler = (
    values: FormState,
    actions: FormikHelpers<FormState>
  ) => {
    console.log({ values, actions })
    actions.setSubmitting(false)

    // const endAddress = formState.endAddress || formState.startAddress
    // onSubmit({
    //   ...formState,
    //   earliestStart: formState.earliestStart
    //     ? moment(formState.earliestStart).format('HH:mm')
    //     : formState.earliestStart,
    //   capacity: {
    //     weight: parseInt(formState.capacity.weight),
    //     volume: parseFloat(formState.capacity.volume),
    //   },
    //   latestEnd: formState.latestEnd
    //     ? moment(formState.latestEnd).format('HH:mm')
    //     : formState.latestEnd,
    //   startAddress: {
    //     ...formState.startAddress,
    //     name: formState.startAddress.name || undefined,
    //   },
    //   endAddress: {
    //     ...endAddress,
    //     name: endAddress.name || undefined,
    //   },
    //   metadata: {
    //     ...formState.metadata,
    //     driver: {
    //       name: formState.metadata.driver.name || undefined,
    //       contact: formState.metadata.driver.contact || undefined,
    //     },
    //   },
    // })

    // return setIsFinished(true)
  }

  const handleOnContinue = () => {
    setIsFinished(false)
  }

  const handleOnClose = () => history.push('/transports')

  if (isFinished)
    return (
      <Success
        onClose={handleOnClose}
        onContinue={handleOnContinue}
        infoText="Transport är nu tillagd!"
      />
    )

  return (
    <MainRouteLayout redirect="/transports">
      <Elements.Layout.ContainerWidth>
        <h3>Lägg till transport</h3>
        <Formik initialValues={initialState} onSubmit={onSubmitHandler}>
          <Form
            formState={formState}
            dispatch={setUIState}
            transportPresets={transportPresets}
            type="NEW"
          />
        </Formik>
      </Elements.Layout.ContainerWidth>
    </MainRouteLayout>
  )
}

export default CreateTransport
