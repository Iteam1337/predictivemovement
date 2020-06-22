import React from 'react'
import { useHistory } from 'react-router-dom'
import locationIcon from '../assets/location.svg'
import Elements from './Elements'

const CreateBooking = ({ createBooking }) => {
  const history = useHistory()
  const [formState, setState] = React.useState({
    pickup: '',
    delivery: '',
  })

  const create = (event) => {
    event.preventDefault()

    const pickup = formState.pickup
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)

    const delivery = formState.delivery
      .split(',')
      .map(parseFloat)
      .filter((x) => !!x)

    if (!pickup.length || !delivery.length) return false
    createBooking({ pickup, delivery })

    history.push('/')
  }

  return (
    <Elements.Container>
      <h3>Skapa en ny bokning</h3>
      <form onSubmit={create} autoComplete="on">
        <div>
          <Elements.InputContainer>
            <Elements.Label htmlFor="pickup">Startpunkt</Elements.Label>
            <Elements.InputInnerContainer>
              <Elements.LocationIcon
                alt="Location pickup icon"
                src={`${locationIcon}`}
              />
              <Elements.TextInput
                name="pickup"
                type="text"
                value={formState.pickup}
                placeholder="61.8294925,16.0565493"
                onChange={(e) =>
                  setState({
                    pickup: e.target.value,
                    delivery: formState.delivery,
                  })
                }
              />
            </Elements.InputInnerContainer>
          </Elements.InputContainer>
        </div>
        <div>
          <Elements.InputContainer>
            <Elements.Label htmlFor="delivery">Delivery</Elements.Label>
            <Elements.InputInnerContainer>
              <Elements.LocationIcon
                alt="Location delivery icon"
                src={`${locationIcon}`}
              />
              <Elements.TextInput
                name="delivery"
                type="text"
                value={formState.delivery}
                placeholder="61.8644045,16.001133"
                onChange={(e) =>
                  setState({
                    pickup: formState.pickup,
                    delivery: e.target.value,
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
export default CreateBooking
