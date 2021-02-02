import React from 'react'
import * as hooks from '../../hooks'
import * as stores from '../../utils/state/stores'
import * as Elements from '../../shared-elements'
import Form from '../forms/CreateTransport'
import moment from 'moment'
import { transportPresets } from '../CreateTransport'

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
  const [formState, setState] = React.useState(transport)
  const setUIState = stores.ui((state) => state.dispatch)

  hooks.useFormStateWithMapClickControl('startAddress', 'endAddress', setState)

  React.useEffect(() => {
    setActive(true)

    return () => setActive(false)
  }, [isActive])

  const onSubmitHandler = (event: any) => {
    event.preventDefault()

    const endAddress = formState.endAddress || formState.startAddress

    const updatedTransport = {
      ...formState,
      earliestStart: formState.earliestStart
        ? moment(formState.earliestStart).format('HH:mm')
        : formState.earliestStart,
      capacity: {
        weight: parseInt(formState.capacity.weight),
        volume: parseFloat(formState.capacity.volume),
      },
      latestEnd: formState.latestEnd
        ? moment(formState.latestEnd).format('HH:mm')
        : formState.latestEnd,
      startAddress: {
        ...formState.startAddress,
        name: formState.startAddress.name || undefined,
      },
      endAddress: {
        ...endAddress,
        name: endAddress.name || undefined,
      },
      metadata: {
        ...formState.metadata,
        driver: {
          name: formState.metadata.driver.name || undefined,
          contact: formState.metadata.driver.contact || undefined,
        },
      },
    }

    updateTransport(
      editableFields
        .filter(
          (key) =>
            JSON.stringify(transport[key]) !== JSON.stringify(formState[key])
        )
        .reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: updatedTransport[curr],
          }),
          { id: updatedTransport.id }
        )
    )

    return setIsFinished(true)
  }

  return (
    <Elements.Layout.Container>
      <h3>Uppdatera transport</h3>
      <Form
        type="EDIT"
        onChangeHandler={setState}
        onSubmitHandler={onSubmitHandler}
        formState={formState}
        dispatch={setUIState}
        transportPresets={transportPresets}
      />
    </Elements.Layout.Container>
  )
}

export default EditTransport
