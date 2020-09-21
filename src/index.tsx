import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './utils/fontawesome'
import { rootId } from './utils/constants'

const render = (Component: React.ComponentType<any>)=> {
  const container = document.getElementById(rootId)

  if (container) {
    ReactDOM.render(
      <React.StrictMode>
        <Component {...container.dataset} />
      </React.StrictMode>,
      container
    )
  }
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    console.clear()
    render(NextApp)
  })
}
