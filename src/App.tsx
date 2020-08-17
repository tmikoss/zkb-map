import React from 'react'
import { useKillmails } from './useKillmails'

function App() {
  const sourceUrl = 'wss://zkillboard.com/websocket/'
  const killmails = useKillmails({ sourceUrl })

  return <pre>
    {JSON.stringify(killmails, null, 2)}
  </pre>
}

export default App;
