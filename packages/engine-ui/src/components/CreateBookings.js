import React from 'react'
import Elements from './Elements'
import { useHistory } from 'react-router-dom'

const CreateBookings = ({ createBookings }) => {
  const history = useHistory()
  const [formState, setState] = React.useState({
    total: '3',
  })

  const create = (event) => {
    event.preventDefault()

    try {
      const total = parseInt(formState.total, 10)
      createBookings(total)
    } catch (ex) {
      return false
    } finally {
      history.push('/')
    }
  }

  return (
    <Elements.Container>
      <h3>Skapa massa bokningar</h3>
      <form onSubmit={create} autoComplete="on">
        <div>
          <Elements.InputContainer>
            <Elements.Label htmlFor="pickup">Total number</Elements.Label>
            <Elements.InputInnerContainer>
              <Elements.TextInput
                name="pickup"
                type="text"
                value={formState.total}
                placeholder="3"
                onChange={(e) =>
                  setState({
                    total: e.target.value,
                  })
                }
              />
            </Elements.InputInnerContainer>
          </Elements.InputContainer>
        </div>
        <Elements.ButtonWrapper>
          <Elements.CancelButton
            type="button"
            onClick={() => history.push('/')}
          >
            Avbryt
          </Elements.CancelButton>
          <Elements.SubmitButton type="submit">Lägg till</Elements.SubmitButton>
        </Elements.ButtonWrapper>
      </form>
    </Elements.Container>
  )
}
export default CreateBookings
