import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useConnection, useConfiguration } from './hooks'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { CameraMode } from './hooks/configuration'

const Container = styled.div`
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-areas: "fullscreen connection camera regions";
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
`

const FullscreenToggle: React.FC = () => {
  const [fullScreen, setFullScreen] = useState(false)

  const onClick = () => {
    if (fullScreen) {
      document.exitFullscreen().then(() => setFullScreen(false))
    } else {
      document.getElementById('root')?.requestFullscreen().then(() => setFullScreen(true))
    }
  }

  return <FlatButton type='button' title={fullScreen ? 'Exit fullscreen' : 'Go fullscreen'} onClick={onClick} area='fullscreen'>
    <FontAwesomeIcon icon={fullScreen ? 'compress-arrows-alt' : 'expand-arrows-alt'} />
  </FlatButton>
}

const ConnectionStatus: React.FC = () => {
  const connected = useConnection(useCallback(state => state.connected, []))

  return <FlatButton type='button' title={connected ? 'Connected to live feed' : 'Disconnected from live feed!'} area='connection'>
    <FontAwesomeIcon icon={connected ? 'link' : 'unlink'} />
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

const RegionNames: React.FC = () => {
  const enabled = useConfiguration(useCallback(state => state.showRegionNames, []))
  const toggle = useConfiguration(useCallback(state => state.toggleRegionNames, []))

  return <FlatButton type='button' title={enabled ? 'Region names shown' : 'Region names hidden'} onClick={toggle} area='regions'>
    <FontAwesomeIcon icon={enabled ? 'list-alt' : 'list'} />
  </FlatButton>
}

const Controls: React.FC = () => {
  return <Container>
    <FullscreenToggle />
    <ConnectionStatus />
    <CameraStatus />
    <RegionNames />
  </Container>
}

export default Controls
