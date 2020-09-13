import React, { useState } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from './store'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { CameraMode } from './store/configuration'
import { updateConfiguration } from './store'

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

  return <FlatButton type='button' onClick={onClick} area='fullscreen'>
    <FontAwesomeIcon icon={fullScreen ? 'compress-arrows-alt' : 'expand-arrows-alt'} />
  </FlatButton>
}

const ConnectionStatus: React.FC = () => {
  const connected = useAppSelector(state => state.connection.connected)

  return <FlatButton type='button' area='connection'>
    <FontAwesomeIcon icon={connected ? 'link' : 'unlink'} />
  </FlatButton>
}

const cameraIcon: Record<CameraMode, FontAwesomeIconProps['icon']> = {
  [CameraMode.full]: 'arrows-alt',
  [CameraMode.follow]: 'video'
}

const nextCameraModes: Record<CameraMode, CameraMode> = {
  [CameraMode.full]: CameraMode.follow,
  [CameraMode.follow]: CameraMode.full
}

const CameraStatus: React.FC = () => {
  const mode = useAppSelector(state => state.configuration.cameraMode)
  const dispatch = useAppDispatch()

  const onClick = () => {
    const nextCameraMode = nextCameraModes[mode]
    dispatch(updateConfiguration({ cameraMode: nextCameraMode }))
  }

  return <FlatButton type='button' onClick={onClick} area='camera'>
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
