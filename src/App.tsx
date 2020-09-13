import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import styled, { createGlobalStyle, ThemeProvider, ThemeContext } from 'styled-components'
import reset from 'styled-reset'
import { Canvas } from 'react-three-fiber'
import { theme } from './utils/theme'
import Stars from './Stars'
import Flares from './Flares'
import KillmailTicker from './KillmailTicker'
import { useAppSelector, fetchSolarSystems, useAppDispatch } from './store'
import DevTools from './DevTools'
import { useConnectionStatus } from './useConnectionStatus'
import Controls from './Controls'
import Camera from './Camera'
import sortBy from 'lodash/sortBy'
import reduce from 'lodash/reduce'

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

const App: React.FC<{}> = () => {
  const dispatch = useAppDispatch()

  useKillmails({ sourceUrl: 'wss://zkillboard.com/websocket/', preloadRecent: devMode })

  useConnectionStatus()

  useEffect(() => {
    dispatch(fetchSolarSystems())
  }, [dispatch])

  const killmailsRef = useRef<Killmail[]>([])

  const solarSystems = useAppSelector(state => state.solarSystems)
  const killmails = useAppSelector(state => {
    const inCurrentSystems = reduce(state.killmails, (arr, km) => {
      if (solarSystems[km.solarSystemId]) {
        arr.push(km)
      }
      return arr
    }, [] as Killmail[])
    return sortBy(inCurrentSystems, 'receivedAt').reverse()
  })
  const mode = useAppSelector(state => state.configuration.cameraMode)

  useEffect(() => {
    killmailsRef.current = killmails
  }, [killmails])

  return <ThemeProvider theme={theme}>
    <GlobalStyle />

    <Canvas onCreated={({ gl }) => gl.setClearColor(theme.background)}>
      <ThemeContext.Provider value={theme}>
        <ambientLight />

        <Stars solarSystems={solarSystems} />
        <Flares solarSystems={solarSystems} killmails={killmailsRef} />

        <Camera solarSystems={solarSystems} killmails={killmailsRef} mode={mode} />
      </ThemeContext.Provider>
    </Canvas>

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
