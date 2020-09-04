import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import { useSolarSystems } from './useSolarSytems'
import Map from './Map'
import KillmailEntry from './KillmailEntry'

const App: React.FC<{}> = () => {
  const sourceUrl = 'wss://zkillboard.com/websocket/'
  const killmails = useKillmails({ sourceUrl })
  const solarSystems = useSolarSystems()
  const killmailsRef = useRef<typeof killmails>([])

  useEffect(() => {
    killmailsRef.current = killmails
  }, [killmails])

  return <>
    <div style={{height: 600}}>
      {solarSystems.length > 0 && <Map solarSystems={solarSystems} killmails={killmailsRef} />}
    </div>
    {killmails.map(km => <KillmailEntry killmail={km} key={km.id} />)}
  </>
}

export default App;
