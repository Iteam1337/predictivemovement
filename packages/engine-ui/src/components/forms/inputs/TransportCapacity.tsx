import { useField, useFormikContext } from 'formik'
import React from 'react'
import * as Elements from '../../../shared-elements'
import * as FormInputs from '.'

const TransportCapacity: React.FC<{
  useCustomCapacity: any
  name: string
  setUseCustomCapacity: (value: boolean) => void
  transportPresets: {
    [s: string]: {
      weight: string
      volume: string
    }
  }
}> = ({ name, useCustomCapacity, transportPresets, setUseCustomCapacity }) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(name)

  const handleTransportPresetSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === 'custom') {
      setUseCustomCapacity(!useCustomCapacity)
      return setFieldValue(field.name, {
        weight: '',
        volume: '',
      })
    }
    return setFieldValue(field.name, {
      weight: transportPresets[e.target.value].weight,
      volume: transportPresets[e.target.value].volume,
    })
  }
  const transportPresetNameToHumanReadable = (name: string) => {
    switch (name) {
      case 'small':
        return 'Liten'
      case 'medium':
        return 'Medium'
      case 'big':
        return 'Stor'
    }
  }
  const transportSelectOptions = Object.entries(transportPresets)
    .map(([name, { weight, volume }]) => ({
      value: name,
      label: transportPresetNameToHumanReadable(name),
      weight,
      volume,
    }))
    .concat({
      value: 'custom',
      label: '',
      weight: '',
      volume: '',
    })

  return !useCustomCapacity ? (
    <Elements.Form.SelectInput
      as="select"
      name={name}
      onChange={handleTransportPresetSelectChange}
    >
      {transportSelectOptions.map(({ label, value, weight, volume }) => {
        if (value === 'custom') {
          return (
            <option key={value} value="custom">
              Ange anpassad kapacitet
            </option>
          )
        }

        return (
          <option key={value} value={value}>
            {label} (max {volume} m3, {weight} kg)
          </option>
        )
      })}
    </Elements.Form.SelectInput>
  ) : (
    <>
      <Elements.Layout.InputContainer>
        <FormInputs.TextInput
          step={0.1}
          min="0"
          required
          name="capacity.volume"
          placeholder="Lastvolym (m3)"
          type="number"
        />
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputContainer>
        <FormInputs.TextInput
          step={1}
          min="0"
          type="number"
          required
          name="capacity.weight"
          placeholder="Maxvikt (kg)"
        />

        <Elements.Buttons.CancelButton
          padding="0.5rem"
          style={{
            marginTop: '0.5rem',
          }}
          onClick={() => setUseCustomCapacity(!useCustomCapacity)}
        >
          Återgå till förval
        </Elements.Buttons.CancelButton>
      </Elements.Layout.InputContainer>
    </>
  )
}

export default TransportCapacity
