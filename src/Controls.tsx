import React, { useState } from 'react'
import styled from 'styled-components'
import { useAppSelector } from './store'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { useConfiguration, CameraMode } from './store/configuration'

const Container = styled.div`
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-areas: "fullscreen connection camera";
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
  const connected = useAppSelector(state => state.connection.connected)

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
  const mode = useConfiguration(state => state.cameraMode)
  const update = useConfiguration(state => state.update)

  const onClick = () => {
    const nextCameraMode = nextCameraModes[mode]
    update({ cameraMode: nextCameraMode })
  }

  return <FlatButton type='button' title={cameraTitles[mode]} onClick={onClick} area='camera'>
    <FontAwesomeIcon icon={cameraIcon[mode]} />
  </FlatButton>
}

const Controls: React.FC = () => {
  return <Container>
    <FullscreenToggle />
    <ConnectionStatus />
    <CameraStatus />
  </Container>
}

export default Controls
