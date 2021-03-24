import { useField, useFormikContext } from 'formik'
import React from 'react'
import * as Elements from '../../../shared-elements'
import * as FormInputs from '../inputs'

const ParcelSize: React.FC<{
  useCustomSize: any
  name: string
  setUseCustomSize: (value: boolean) => void
  parcelSizePresets: {
    [s: string]: {
      weight: number
      measurements: string
    }
  }
}> = ({ parcelSizePresets, useCustomSize, setUseCustomSize, name }) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(name)

  const handleParcelSizeSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === 'custom') {
      return setUseCustomSize(!useCustomSize)
    }

    return setFieldValue(field.name, {
      weight: parcelSizePresets[e.target.value].weight,
      measurements: parcelSizePresets[e.target.value].measurements,
    })
  }
  const parcelSizeToHumanReadable = (name: string) => {
    switch (name) {
      case 'small':
        return 'Liten'
      case 'medium':
        return 'Medium'
      case 'big':
        return 'Stor'
      default:
        return 'Storlek saknas'
    }
  }

  const parcelSizeSelectOptions = Object.entries(parcelSizePresets)
    .map(([name, { weight, measurements }]) => ({
      value: name,
      label: parcelSizeToHumanReadable(name),
      weight,
      measurements,
    }))
    .concat({ value: 'custom', label: '', weight: 0, measurements: '' })

  return !useCustomSize ? (
    <Elements.Form.SelectInput
      as="select"
      name={name}
      onChange={handleParcelSizeSelectChange}
    >
      {parcelSizeSelectOptions.map(({ label, value, weight, measurements }) => {
        if (value === 'custom') {
          return (
            <option key={value} value="custom">
              Ange anpassad kapacitet
            </option>
          )
        }

        return (
          <option key={value} value={value}>
            {label} ({measurements} cm, {weight} kg)
          </option>
        )
      })}
    </Elements.Form.SelectInput>
  ) : (
    <>
      <Elements.Layout.InputContainer>
        <FormInputs.TextInput
          required
          name="size.measurements"
          placeholder="Mått (BxHxDcm)"
          pattern="(\d+)x(\d+)x(\d+)"
          title="BxHxD cm"
        />
      </Elements.Layout.InputContainer>
      <Elements.Layout.InputContainer>
        <FormInputs.TextInput
          step={1}
          name="size.weight"
          placeholder="Vikt (kg)"
          type="number"
          required
          isRequiredInline
        />

        <Elements.Buttons.CancelButton
          padding="0.5rem"
          style={{
            marginTop: '0.5rem',
          }}
          onClick={() => setUseCustomSize(!useCustomSize)}
        >
          Återgå till förval
        </Elements.Buttons.CancelButton>
      </Elements.Layout.InputContainer>
    </>
  )
}

export default ParcelSize
