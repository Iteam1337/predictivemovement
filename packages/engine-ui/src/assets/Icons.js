import React from 'react'

const Arrow = (props) => {
  return (
    <svg width={11} height={8} viewBox="0 0 11 8" fill="none" {...props}>
      <path
        d="M5.469 7.031a.736.736 0 001.031 0l4.25-4.25c.313-.312.313-.781 0-1.062L10.062 1C9.75.719 9.283.719 9 1L5.969 4.031 2.969 1c-.281-.281-.75-.281-1.063 0l-.687.719c-.313.281-.313.75 0 1.062l4.25 4.25z"
        fill="#666"
      />
    </svg>
  )
}

export default { Arrow }
