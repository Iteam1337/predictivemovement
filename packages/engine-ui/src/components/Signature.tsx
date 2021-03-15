import React from 'react'
import * as Elements from '../shared-elements'
import moment from 'moment'
import styled from 'styled-components'

import * as types from '../types'

const ImageWrapper = styled.div`
  width: 272px;
  height: 109px;
  border: 1px solid #e5e5e5;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`

const Image = styled.img`
  padding: 1rem;
  max-width: 272px;
  max-height: 109px;
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

        {signature.type === 'manual' && (
          <>
            <Elements.Layout.MarginBottomContainer>
              <Elements.Typography.InfoMd>
                Signerat med manuell kvittens. Föraren har ansvaret för att
                signaturen har samlats in.
              </Elements.Typography.InfoMd>
            </Elements.Layout.MarginBottomContainer>
            <Elements.Typography.InfoMd>
              Bokningen levererades
            </Elements.Typography.InfoMd>
          </>
        )}
        {signature.type === 'signature' && (
          <>
            <ImageWrapper>
              <Image
                src={signature.receipt.base64Signature}
                alt={signature.signedBy}
              />
            </ImageWrapper>
            <Elements.Typography.InfoMd>
              {signature.signedBy}
            </Elements.Typography.InfoMd>
          </>
        )}
        {signature.type === 'photo' && (
          <>
            <Elements.Layout.MarginBottomContainer>
              <Elements.Typography.InfoMd>
                Signerat med foto
              </Elements.Typography.InfoMd>
            </Elements.Layout.MarginBottomContainer>
            <Elements.Layout.MarginBottomContainer>
              <a
                style={{ color: 'inherit' }}
                href={`${signature.receipt.photo}`}
                download={signature.signedBy}
              >
                <Elements.Buttons.SubmitButton
                  type="button"
                  padding="0.75rem 1.25rem"
                >
                  Ladda ner signatur
                </Elements.Buttons.SubmitButton>
              </a>
            </Elements.Layout.MarginBottomContainer>
            <Elements.Typography.InfoMd>
              Bokningen levererades
            </Elements.Typography.InfoMd>
          </>
        )}

        <Elements.Typography.InfoMd>
          {formatDate(signature.createdAt)}
        </Elements.Typography.InfoMd>
      </Elements.Layout.SectionWithMargin>
    </div>
  )
}

export default Signature
