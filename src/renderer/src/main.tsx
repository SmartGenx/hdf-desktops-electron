import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Debug information
console.log('React renderer starting...')
console.log('Current environment:', import.meta.env.MODE)
console.log('Root element:', document.getElementById('root'))

const root = document.getElementById('root')
if (!root) {
  console.error('Root element not found! Check your index.html')
} else {
  console.log('Root element found, starting React...')
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
