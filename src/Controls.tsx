import React, { useState, useEffect, useCallback, useRef, useContext } from 'react'
import styled from 'styled-components'
import { useAppDispatch, receiveKillmail, useAppSelector } from './store'
import { Stats } from 'drei'
import random from 'lodash/random'
import sample from 'lodash/sample'
import { scaleValue, normalKillmailAgeMs } from './utils/scaling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ThemeContext } from 'styled-components'

const Container = styled.div`
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-areas: "fullscreen connection";
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

const Controls: React.FC = () => {
  return <Container>
    <FullscreenToggle />
    <ConnectionStatus />
  </Container>
}

export default Controls
