import React from 'react'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'
import * as Elements from '../styles/'
import nameIcon from '../assets/contact-name.svg'
import { Form, FormikFormProps, FormikProps, useFormikContext } from 'formik'
import { SignFormState } from './SignParcel'

const CanvasContainer = styled.div`
  background: white;
  height: 200px;
  border: 2px dashed black;
  border-radius: 10px;
  width: 99.9%;
  display: flex;

  @media only screen and (max-device-height: 380px) {
    height: 150px;
  }
  @media only screen and (max-device-height: 320px) {
    height: 100px;
  }
`

const ButtonContainer = styled.div`
  max-width: 300px;
  width: 100%;
  display: flex;
  button:first-of-type {
    margin-right: 1rem;
  }
`

const Signature = React.forwardRef((props: any, ref: any) => {
  const { setFieldValue } = useFormikContext()
  const onDrawEnd = () =>
    setFieldValue(
      'receipt.base64Signature',
      ref?.current?.getTrimmedCanvas().toDataURL()
    )

  return (
    <CanvasContainer>
      <SignatureCanvas
        {...props}
        onEnd={onDrawEnd}
        clearOnResize={false}
        ref={ref}
        penColor="black"
        canvasProps={{
          className: 'signature_canvas',
        }}
      />
    </CanvasContainer>
  )
})

const SignForm: React.FC<{ recipientName: string | undefined }> = ({
  recipientName,
}) => {
  const nodeRef = React.useRef<any>(null)
  const {
    resetForm,
    errors,
    touched,
    setFieldValue,
  }: FormikProps<SignFormState> = useFormikContext()

  React.useEffect(() => {
    if (recipientName) {
      setFieldValue('signedBy', recipientName)
    }
  }, [recipientName])

  const clear = () => {
    nodeRef?.current?.clear()
    resetForm()
  }

  const validateNotEmpty = (value: string) => {
    let error
    if (value === '') {
      error = 'Detta fält är obligatoriskt'
    }

    return error
  }

  return (
    <Form>
      <div>
        <Elements.BoldParagraph>
          Rita din signatur i rutan.
        </Elements.BoldParagraph>
        <Elements.TextInput
          name="receipt.base64Signature"
          validate={validateNotEmpty}
        >
          {(props: FormikFormProps) => <Signature {...props} ref={nodeRef} />}
        </Elements.TextInput>
        {errors.receipt?.base64Signature &&
          touched.receipt?.base64Signature && (
            <Elements.ErrorMessage>
              {errors.receipt.base64Signature}
            </Elements.ErrorMessage>
          )}
        <Elements.MarginTopContainerSm>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <Elements.TextInput
              name="signedBy"
              placeholder="Namn"
              iconinset="true"
              validate={validateNotEmpty}
            />
            {errors.signedBy && touched.signedBy && (
              <Elements.ErrorMessage>{errors.signedBy}</Elements.ErrorMessage>
            )}
          </Elements.InputInnerContainer>
        </Elements.MarginTopContainerSm>
      </div>
      <Elements.MarginTopContainer></Elements.MarginTopContainer>
      <ButtonContainer>
        <Elements.CancelButton type="reset" onClick={clear}>
          Rensa
        </Elements.CancelButton>
        <Elements.SubmitButton type="submit">Bekräfta</Elements.SubmitButton>
      </ButtonContainer>
    </Form>
  )
}

export default SignForm
