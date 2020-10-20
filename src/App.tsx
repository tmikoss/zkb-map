import React, { useRef, useEffect, useCallback, memo } from 'react'
import styled, { ThemeProvider, ThemeContext } from 'styled-components'
import { Canvas } from 'react-three-fiber'
import { theme, Theme } from './utils/theme'
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
import FocusIndicator from './FocusIndicator'

const devMode = process.env.NODE_ENV === 'development'

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

const StyledCanvas = styled(Canvas)`
  outline: none;
`

const Visuals: React.FC<{
  solarSystems: Record<string, SolarSystem>
  killmails: React.MutableRefObject<Killmail[]>
  theme: Theme
}> = memo(({ solarSystems, killmails, theme }) => {
  return <StyledCanvas onCreated={({ gl }) => gl.setClearColor(theme.background)} colorManagement={false}>
    <ThemeContext.Provider value={theme}>
      <Stars solarSystems={solarSystems} />
      <Flares solarSystems={solarSystems} killmails={killmails} />
      <FocusIndicator />

      <Camera solarSystems={solarSystems} killmails={killmails} />

      <Effects />
    </ThemeContext.Provider>
  </StyledCanvas>
})

export interface AppProps {
  websocketUrl: string
  universeUrl: string
}

const App: React.FC<AppProps> = ({ websocketUrl, universeUrl }) => {
  useKillmailMonitor(websocketUrl)
  useSolarSystemData(universeUrl)
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
    <Visuals solarSystems={solarSystems} killmails={killmailsRef} theme={theme} />

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
