import React from 'react'
import { renderToString } from 'react-dom/server'

import App from './index'

export default function(initialState) {
  initialState = initialState || { name: 'default renderer name' }
  return renderToString(
    <App name={initialState.name}/>
  )
}
