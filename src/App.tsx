import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import { CameraControls } from './CameraControls'
import { theme, ThemeContext } from './utils/theme'
import Stars from './Stars'
import Flares from './Flares'
import KillmailTicker from './KillmailTicker'
import { useAppSelector, fetchSolarSystems, useAppDispatch } from './store'
import DevTools from './DevTools'

const devMode = process.env.NODE_ENV === 'development'

const GlobalStyle = createGlobalStyle`
  ${reset}

  #root {
    height: 100vh;
    background: ${theme.background};
    overflow: hidden;
  }

  canvas {
    outline: 0;
  }
`

const cameraConfig  = {
  position: new THREE.Vector3(0, 0, 1_000),
  near: 0.001,
  far: 10_000
}

const App: React.FC<{}> = () => {
  const dispatch = useAppDispatch()

  const sourceUrl = 'wss://zkillboard.com/websocket/'
  useKillmails(sourceUrl)

  useEffect(() => {
    dispatch(fetchSolarSystems())
  }, [dispatch])

  const killmailsRef = useRef<Killmail[]>([])

  const solarSystems = useAppSelector(state => state.solarSystems)
  const killmails = useAppSelector(state => state.killmails)

  useEffect(() => {
    killmailsRef.current = Object.values(killmails)
  }, [killmails])

  return <ThemeContext.Provider value={theme}>
    <GlobalStyle />

    <Canvas camera={cameraConfig} onCreated={({ gl }) => gl.setClearColor(theme.background)}>
      <ambientLight />

      <Stars solarSystems={solarSystems} />
      <Flares solarSystems={solarSystems} killmails={killmailsRef} />

      <CameraControls />
    </Canvas>

    <KillmailTicker killmails={killmails} solarSystems={solarSystems} />
    {devMode && <DevTools />}
  </ThemeContext.Provider>
}

export default App;
