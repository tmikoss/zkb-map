import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import { useSolarSystems } from './useSolarSytems'
import Map from './Map'

const App: React.FC<{}> = () => {
  const sourceUrl = 'wss://zkillboard.com/websocket/'
  const killmails = useKillmails({ sourceUrl })
  const solarSystems = useSolarSystems()
  const scales = useRef({})

  useEffect(() => {
    const conflictScale = killmails.reduce((hash, killmail) => {
      const { solarSystemId } = killmail
      hash[solarSystemId] = ((hash[solarSystemId] || 0) + 10) * 2
      return hash
    }, {} as Record<number, number>)
    scales.current = conflictScale
  }, [killmails])

  return <>
    <div style={{height: 500}}>
      <Map solarSystems={solarSystems} scales={scales} />
    </div>
    <pre>
      {JSON.stringify(killmails, null, 2)}
    </pre>
  </>
}

export default App;
