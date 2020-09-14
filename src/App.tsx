import React, { useRef, useEffect, useCallback, memo } from 'react'
import styled, { createGlobalStyle, ThemeProvider, ThemeContext } from 'styled-components'
import reset from 'styled-reset'
import { Canvas } from 'react-three-fiber'
import { theme } from './utils/theme'
import Stars from './Stars'
import Flares from './Flares'
import KillmailTicker from './KillmailTicker'
import { useKillmails, useSolarSystems, useConnectionStatus, useKillmailMonitor, useSolarSystemData } from './hooks'
import DevTools from './DevTools'
import Controls from './Controls'
import Camera from './Camera'
import sortBy from 'lodash/sortBy'
import reduce from 'lodash/reduce'
import Effects from './Effects'
import RegionNames from './RegionNames'

const devMode = process.env.NODE_ENV === 'development'

const GlobalStyle = createGlobalStyle`
  ${reset}

  #root {
    height: 100vh;
    background: ${({ theme }) => theme.background};
    overflow: hidden;
  }

  canvas {
    outline: 0;
  }
`

const TopLeft = styled.div`
  position: absolute;
  top: 1vmin;
  left: 1vmin;
`

const TopRight = styled.div`
  position: absolute;
  top: 1vmin;
  right: 1vmin;
`

const Visuals: React.FC<{
  solarSystems: Record<string, SolarSystem>
  killmails: React.MutableRefObject<Killmail[]>
}> = memo(({ solarSystems, killmails }) => {
  return <Canvas onCreated={({ gl }) => gl.setClearColor(theme.background)}>
    <ThemeContext.Provider value={theme}>
      <ambientLight />

      <Stars solarSystems={solarSystems} />
      <Flares solarSystems={solarSystems} killmails={killmails} />
      <RegionNames solarSystems={solarSystems} />

      <Camera solarSystems={solarSystems} killmails={killmails} />

      <Effects />
    </ThemeContext.Provider>
  </Canvas>
})

const App: React.FC<{}> = () => {
  useKillmailMonitor('wss://zkillboard.com/websocket/')
  useSolarSystemData(process.env.PUBLIC_URL + '/data/universe.json')
  useConnectionStatus()

  const killmailsRef = useRef<Killmail[]>([])

  const solarSystems = useSolarSystems(useCallback(state => state.systems, []))

  const killmails = useKillmails(useCallback(state => {
    const inCurrentSystems = reduce(state.killmails, (arr, km) => {
      if (solarSystems[km.solarSystemId]) {
        arr.push(km)
      }
      return arr
    }, [] as Killmail[])
    return sortBy(inCurrentSystems, 'receivedAt').reverse()
  }, [solarSystems]))

  useEffect(() => {
    killmailsRef.current = killmails
  }, [killmails])

  return <ThemeProvider theme={theme}>
    <GlobalStyle />

    <Visuals solarSystems={solarSystems} killmails={killmailsRef} />

    <TopLeft>
      <KillmailTicker killmails={killmails} />
    </TopLeft>

    <TopRight>
      <Controls />
      {devMode && <DevTools />}
    </TopRight>
  </ThemeProvider>
}

export default App;
