import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import styled, { createGlobalStyle, ThemeProvider, ThemeContext } from 'styled-components'
import reset from 'styled-reset'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import { theme } from './utils/theme'
import Stars from './Stars'
import Flares from './Flares'
import KillmailTicker from './KillmailTicker'
import { useAppSelector, fetchSolarSystems, useAppDispatch } from './store'
import DevTools from './DevTools'
import { useConnectionStatus } from './useConnectionStatus'
import Controls from './Controls'
import Camera from './Camera'

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

  const sourceUrl = 'wss://zkillboard.com/websocket/'
  useKillmails(sourceUrl)

  useConnectionStatus()

  useEffect(() => {
    dispatch(fetchSolarSystems())
  }, [dispatch])

  const killmailsRef = useRef<Killmail[]>([])

  const solarSystems = useAppSelector(state => state.solarSystems)
  const killmails = useAppSelector(state => state.killmails)

  useEffect(() => {
    killmailsRef.current = Object.values(killmails)
  }, [killmails])

  return <ThemeProvider theme={theme}>
    <GlobalStyle />

    <Canvas onCreated={({ gl }) => gl.setClearColor(theme.background)}>
      <ThemeContext.Provider value={theme}>
        <ambientLight />

        <Stars solarSystems={solarSystems} />
        <Flares solarSystems={solarSystems} killmails={killmailsRef} />

        <Camera />
      </ThemeContext.Provider>
    </Canvas>

    <TopLeft>
      <KillmailTicker killmails={killmails} solarSystems={solarSystems} />
    </TopLeft>

    <TopRight>
      <Controls />
      {devMode && <DevTools />}
    </TopRight>
  </ThemeProvider>
}

export default App;
