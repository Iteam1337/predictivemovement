import { FormikProps, useField, useFormikContext } from 'formik'
import React from 'react'
import * as Elements from '../../../shared-elements'
import { BookingFormState } from '../../CreateBooking'
import * as FormInputs from '../inputs'
import { validateMeasurementsFormat, validateNotEmpty } from '../validation'

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
  const {
    setFieldValue,
    errors,
    touched,
  }: FormikProps<BookingFormState> = useFormikContext()
  const [field] = useField(name)

  const handleParcelSizeSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === 'custom') {
      setUseCustomSize(!useCustomSize)
      return setFieldValue(field.name, {
        weight: '',
        measurements: '',
      })
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
          name="size.measurements"
          placeholder="Mått (BxHxDcm)"
          validate={validateMeasurementsFormat}
        />
      </Elements.Layout.InputContainer>
      {errors.size?.measurements && touched.size?.measurements && (
        <Elements.Typography.ErrorMessage>
          {errors.size.measurements}
        </Elements.Typography.ErrorMessage>
      )}
      <Elements.Layout.InputContainer>
        <FormInputs.TextInput
          step={1}
          name="size.weight"
          placeholder="Vikt (kg)"
          type="number"
          validate={validateNotEmpty}
        />
        {errors.size?.weight && touched.size?.weight && (
          <Elements.Typography.ErrorMessage>
            {errors.size.weight}
          </Elements.Typography.ErrorMessage>
        )}

        <Elements.Buttons.CancelButton
          padding="0.5rem"
          style={{
            marginTop: '0.5rem',
          }}
          onClick={() => {
            setUseCustomSize(!useCustomSize)
            setFieldValue(field.name, {
              weight: parcelSizePresets.small.weight,
              measurements: parcelSizePresets.small.measurements,
            })
          }}
        >
          Återgå till förval
        </Elements.Buttons.CancelButton>
      </Elements.Layout.InputContainer>
    </>
  )
}

export default ParcelSize
