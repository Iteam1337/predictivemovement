import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.js'
import * as serviceWorker from './serviceWorker'
import { SocketIOProvider } from 'use-socketio'
console.log('starting UI against server', process.env.REACT_APP_ENGINE_SERVER)
ReactDOM.render(
  <SocketIOProvider
    url={process.env.REACT_APP_ENGINE_SERVER || 'http://localhost:4000'}
  >
    <App />
  </SocketIOProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
