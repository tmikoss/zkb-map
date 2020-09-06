import React, { useRef, useEffect } from 'react'
import { useKillmails } from './useKillmails'
import { useSolarSystems } from './useSolarSytems'
import Map from './Map'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import { Canvas } from 'react-three-fiber'
import * as THREE from 'three'
import { CameraControls } from './CameraControls'
import { theme, ThemeContext } from './utils/theme'

const GlobalStyle = createGlobalStyle`
  ${reset}

  #root {
    height: 100vh;
    background: ${theme.background};
  }
`

const cameraConfig  = {
  position: new THREE.Vector3(0, -1_000, 0),
  near: 0.001,
  far: 10_000
}

const App: React.FC<{}> = () => {
  const sourceUrl = 'wss://zkillboard.com/websocket/'
  const killmails = useKillmails({ sourceUrl })
  const solarSystems = useSolarSystems()
  const killmailsRef = useRef<typeof killmails>([])

  useEffect(() => {
    killmailsRef.current = killmails
  }, [killmails])

  return <ThemeContext.Provider value={theme}>
    <GlobalStyle />

    <Canvas camera={cameraConfig} onCreated={({ gl }) => gl.setClearColor(theme.background)}>
      <ambientLight />

      <Map solarSystems={solarSystems} killmails={killmailsRef} />

      <CameraControls />
    </Canvas>
  </ThemeContext.Provider>
}

export default App;
