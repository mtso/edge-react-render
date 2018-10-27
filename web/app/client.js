import React from 'react'
import { render, hydrate } from 'react-dom'

import App from './index'

// Initialize the React app on the client with a delay so that pre-rendered markup is noticeable.
setTimeout(function() {
  const initialState = window.__INITIAL_STATE__ || { name: 'default client name' }

  // Check if edge runtime has pre-rendered app.
  const renderedMetaFlag = document.querySelector('meta[name=edge_app_rendered]')
  const isRendered = renderedMetaFlag &&
    renderedMetaFlag.getAttribute('content') === 'true'

  if (isRendered) {
    hydrate(
      <App name={initialState.name} />,
      document.querySelector('#app')
    )
  } else {
    render(
      <App name={initialState.name} />,
      document.querySelector('#app')
    )
  }

}, 2000)
