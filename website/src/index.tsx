import React from 'react'
import { render, hydrate } from 'react-dom'

import { App } from './app'
import './service'

const rootElement = document.querySelector('#root') || document.body

if (rootElement.children.length) {
  hydrate(<App />, rootElement)
} else {
  render(<App />, rootElement)
}
