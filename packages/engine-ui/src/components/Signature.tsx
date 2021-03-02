import React from 'react'
import * as Elements from '../shared-elements'
import moment from 'moment'
import styled from 'styled-components'

import * as types from '../types'
import { sign } from 'crypto'

const Image = styled.img`
  width: 272px;
  height: 109px;
  border: 1px solid #e5e5e5;
  padding: 1rem;
`
interface Props {
  signature: types.Signature
}

const Signature = ({ signature }: Props) => {
  const formatDate = (date: string) => moment(date).format('YYYY-MM-DD HH:mm')

  return (
    <div>
      <Elements.Layout.SectionWithMargin>
        <Elements.Typography.StrongParagraph>
          Kvittens
        </Elements.Typography.StrongParagraph>
        {signature.receipt.base64Signature && (
          <Image
            src={signature.receipt.base64Signature}
            alt={signature.signedBy}
          />
        )}
        {signature.receipt.photo && (
          <>
            <a href={`${signature.receipt.photo}.png`} download>
              Ladda ner
            </a>
            <Elements.Buttons.SubmitButton
              onClick={() => console.log('click')}
              type="button"
              padding="0.75rem 1.25rem"
            >
              Ladda ner foto
            </Elements.Buttons.SubmitButton>
          </>
        )}
        <Elements.Typography.InfoMd>
          {signature.signedBy}
        </Elements.Typography.InfoMd>
        <Elements.Typography.InfoMd>
          {formatDate(signature.createdAt)}
        </Elements.Typography.InfoMd>
      </Elements.Layout.SectionWithMargin>
    </div>
  )
}

export default Signature
