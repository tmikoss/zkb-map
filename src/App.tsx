import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import { useSolarSystems } from './useSolarSytems'
import Map from './Map'
import KillmailEntry from './KillmailEntry'

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
      {solarSystems.length > 0 && <Map solarSystems={solarSystems} scales={scales} />}
    </div>
    {killmails.map(km => <KillmailEntry killmail={km} key={km.id} />)}
  </>
}

export default App;
