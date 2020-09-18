import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './utils/fontawesome'
import { rootId } from './utils/constants'

const render = (Component: React.ComponentType<{}>)=> {
  ReactDOM.render(
    <React.StrictMode>
      <Component />
    </React.StrictMode>,
    document.getElementById(rootId)
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    console.clear()
    render(NextApp)
  })
}