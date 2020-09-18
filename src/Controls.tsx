import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useConnection, useConfiguration } from './hooks'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { CameraMode } from './hooks/configuration'
import { rootId } from './utils/constants'

const Container = styled.div`
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-areas: "fullscreen connection camera sidebar";
  grid-auto-columns: ${({ theme }) => theme.unit}px;
  grid-auto-rows: ${({ theme }) => theme.unit}px;
  gap: ${({ theme }) => theme.gapSize}px;
  direction: rtl;
`

const FlatButton = styled.button<{ area: string }>`
  color: ${({ theme }) => theme.text};
  background: transparent;
  border: none;
  grid-area: ${({ area }) => area};
  cursor: ${({ onClick }) => onClick ? 'pointer' : 'default'};
  outline: none;
`

const OnOffIcon: React.FC<FontAwesomeIconProps & { enabled: boolean }> = ({ enabled, ...other }) => {
  return <span className="fa-layers fa-fw">
    <FontAwesomeIcon {...other} />
    {!enabled && <FontAwesomeIcon icon='slash' />}
  </span>
}

const FullscreenToggle: React.FC = () => {
  const [fullScreen, setFullScreen] = useState(false)

  useEffect(() => {
    const listener = () => setFullScreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', listener)
    return () => document.removeEventListener('fullscreenchange', listener)
  }, [setFullScreen])

  const onClick = () => {
    if (fullScreen) {
      document.exitFullscreen()
    } else {
      document.getElementById(rootId)?.requestFullscreen()
    }
  }

  return <FlatButton type='button' title={fullScreen ? 'Exit fullscreen' : 'Go fullscreen'} onClick={onClick} area='fullscreen'>
    <FontAwesomeIcon icon={fullScreen ? 'compress-arrows-alt' : 'expand-arrows-alt'} />
  </FlatButton>
}

const ConnectionStatus: React.FC = () => {
  const connected = useConnection(useCallback(state => state.connected, []))

  return <FlatButton type='button' title={connected ? 'Connected to live feed' : 'Disconnected from live feed!'} area='connection'>
    <OnOffIcon icon='wifi' enabled={connected} />
  </FlatButton>
}

const cameraIcon: Record<CameraMode, FontAwesomeIconProps['icon']> = {
  [CameraMode.full]: 'globe',
  [CameraMode.follow]: 'video'
}

const nextCameraModes: Record<CameraMode, CameraMode> = {
  [CameraMode.full]: CameraMode.follow,
  [CameraMode.follow]: CameraMode.full
}

const cameraTitles: Record<CameraMode, string> = {
  [CameraMode.full]: 'Camera: whole map',
  [CameraMode.follow]: 'Camera: follow the action'
}

const CameraStatus: React.FC = () => {
  const mode = useConfiguration(useCallback(state => state.cameraMode, []))
  const update = useConfiguration(useCallback(state => state.setCameraMode, []))

  const onClick = () => {
    const nextCameraMode = nextCameraModes[mode]
    update(nextCameraMode)
  }

  return <FlatButton type='button' title={cameraTitles[mode]} onClick={onClick} area='camera'>
    <FontAwesomeIcon icon={cameraIcon[mode]} />
  </FlatButton>
}

const ExtendedTicker: React.FC = () => {
  const enabled = useConfiguration(useCallback(state => state.extendedTicker, []))
  const toggle = useConfiguration(useCallback(state => state.toggleExtendedTicker, []))

  return <FlatButton type='button' title={enabled ? 'Sidebar: full information' : 'Sidebar: only the ship'} onClick={toggle} area='sidebar'>
    <OnOffIcon icon='list' enabled={enabled} />
  </FlatButton>
}

const Controls: React.FC = () => {
  return <Container>
    <FullscreenToggle />
    <ConnectionStatus />
    <CameraStatus />
    <ExtendedTicker />
  </Container>
}

export default Controls
