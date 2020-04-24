import ReactDOM from 'react-dom'
import React from 'react'
import App from './app'
import { ErrorBoundary, } from './components'

ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('root'))
