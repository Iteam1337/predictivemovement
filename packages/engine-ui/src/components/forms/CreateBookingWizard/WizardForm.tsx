import { Form } from 'formik'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import Delivery from './Delivery'
import Pickup from './Pickup'
import Submit from './Submit'

const WisardForm: React.FC<{
  dispatch: any
  type?: 'NEW' | 'EDIT'
  parcelSizePresets: {
    [s: string]: {
      weight: number
      measurements: string
    }
  }
}> = ({ parcelSizePresets, dispatch, type }) => {
  return (
    <Form autoComplete="off">
      <Switch>
        <Redirect
          from="/bookings/add-booking"
          exact
          to="/bookings/add-booking/pickup"
        />
        <Route path="/bookings/add-booking/pickup">
          <Pickup dispatch={dispatch} />
        </Route>
        <Route path="/bookings/add-booking/delivery">
          <Delivery dispatch={dispatch} type={type} />
        </Route>
        <Route path="/bookings/add-booking/submit">
          <Submit
            type={type}
            dispatch={dispatch}
            parcelSizePresets={parcelSizePresets}
          />
        </Route>
      </Switch>
    </Form>
  )
}

export default WisardForm
