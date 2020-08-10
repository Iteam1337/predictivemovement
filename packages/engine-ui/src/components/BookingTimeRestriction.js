import React from 'react'
import DatePicker from 'react-datepicker'

const Component = ({ deliverAtLatest, onChangeHandler }) => {
  return (
    <div style={{ width: '100%' }}>
      <DatePicker
        id="startDate"
        selected={deliverAtLatest}
        onChange={onChangeHandler}
        showTimeSelect
        minDate={new Date()}
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
        autoFocus
        customInput={
          <input
            style={{
              width: '100%',
              padding: '0.25rem 0',
              border: 'none',
            }}
          ></input>
        }
      />
    </div>
  )
}

export default Component
