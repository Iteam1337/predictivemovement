import { useHistory } from 'react-router-dom'
import * as Elements from '../shared-elements'
import Form from './forms/CreateTransport'
import MainRouteLayout from './layout/MainRouteLayout'
import Success from './SuccessScreen'
import * as hooks from '../utils/hooks'
import moment from 'moment'
import * as stores from '../utils/state/stores'
import React from 'react'

const transportPresets = {
  truck: {
    small: { weight: '1234', volume: '18' },
    medium: { weight: '2234', volume: '24' },
    big: { weight: '4234', volume: '36' },
  },
}

const initialState: FormState = {
  id: '',
  capacity: transportPresets.truck.small,
  driver: { name: '', contact: '' },
  timewindow: { start: null, end: null },
  startPosition: { lat: 61.8172594, lon: 16.0561472, name: '' },
  endPosition: null,
  metadata: {
    profile: '',
  },
}

export interface FormState {
  [key: string]: any
  capacity: {
    volume: string
    weight: string
  }
  driver: {
    contact?: string
    name?: string
  }
  endPosition: {
    lat?: number
    lon?: number
    name?: string
  } | null
  id: string
  metadata: {
    profile: string
  }
  startPosition: {
    lat: number
    lon: number
    name?: string
  }
  timewindow: {
    end: string | null
    start: string | null
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

  hooks.useFormStateWithMapClickControl(
    'startPosition',
    'endPosition',
    setState
  )

  React.useEffect(() => {
    setActive(true)

    return () => setActive(false)
  }, [isActive])

  const onSubmitHandler = (event: any) => {
    event.preventDefault()

    const endPosition = formState.endPosition || formState.startPosition
    onSubmit({
      ...formState,
      timewindow:
        formState.timewindow.start && formState.timewindow.end
          ? {
              start: moment(formState.timewindow.start).format('HH:mm'),
              end: moment(formState.timewindow.end).format('HH:mm'),
            }
          : formState.timewindow,
      capacity: {
        weight: parseInt(formState.capacity.weight),
        volume: parseFloat(formState.capacity.volume),
      },
      startPosition: {
        ...formState.startPosition,
        name: formState.startPosition.name || undefined,
      },
      endPosition: {
        ...endPosition,
        name: endPosition.name || undefined,
      },
      metadata: {
        ...formState.metadata,
        driver: {
          name: formState.driver.name || undefined,
          contact: formState.driver.contact || undefined,
        },
      },
    })

    return setIsFinished(true)
  }

  const handleOnContinue = () => {
    setState(initialState)
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
      <Elements.Layout.Container>
        <h3>Lägg till transport</h3>
        <Form
          onChangeHandler={setState}
          onSubmitHandler={onSubmitHandler}
          formState={formState}
          dispatch={setUIState}
          transportPresets={transportPresets}
        />
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default CreateTransport
