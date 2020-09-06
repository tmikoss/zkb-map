import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import { useSolarSystems } from './useSolarSytems'
import Map from './Map'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

const GlobalStyle = createGlobalStyle`
  ${reset}

  #root {
    height: 100vh;
    background: ${({ theme }) => theme.background};
  }
`

const App: React.FC<{}> = () => {
  const sourceUrl = 'wss://zkillboard.com/websocket/'
  const killmails = useKillmails({ sourceUrl })
  const solarSystems = useSolarSystems()
  const killmailsRef = useRef<typeof killmails>([])

  useEffect(() => {
    killmailsRef.current = killmails
  }, [killmails])

  return <>
    <GlobalStyle />
    <Map solarSystems={solarSystems} killmails={killmailsRef} />
  </>
}

export default App;
