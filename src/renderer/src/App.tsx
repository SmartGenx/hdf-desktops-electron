import { useEffect, useState } from 'react'
import Providers from './components/providers/providers'

function App(): JSX.Element {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    console.log('App component mounted, checking server status...')
    fetch('http://localhost:5050/health')
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data)
        setIsConnected(true)
      })
      .catch(error => {
        console.error('Server connection error:', error)
        setIsConnected(false)
      })
  }, [])

  // Status indicator styles based on connection state
  const getStatusColor = () => {
    if (isConnected === null) return '#888'; // Gray for checking
    return isConnected ? '#4CAF50' : '#000'; // Green when connected, black when not
  }

  return (
    <div>
      <div style={{ 
        position: 'fixed', 
        top: 10, 
        right: 90, // Position in top right corner near the logo
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        zIndex: 9999,
        fontFamily: 'Arial',
        fontSize: '12px'
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          border: '1px solid #ccc',
          display: 'inline-block'
        }} />
      </div>
      <Providers />
    </div>
  )
}

export default App
