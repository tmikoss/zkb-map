import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { ageMultiplier, killmailFullyVisibleMs } from './utils/scaling'
import { animated, useSpring, OpaqueInterpolation } from 'react-spring'
import { useAnimationFrame } from './useAnimationFrame'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { ThemeContext } from 'styled-components'

const TickerContainer = styled.div`
  overflow: hidden;
  max-height: calc(100vh - ${({ theme }) => theme.unit}px);
  display: flex;
  flex-flow: column;
`

const EntryContainer = styled(animated.div)`
  display: grid;
  grid-template-areas: "ship character corporation alliance";
  grid-auto-columns: ${({ theme }) => theme.unit}px;
  grid-auto-rows: ${({ theme }) => theme.unit}px;
  gap: ${({ theme }) => theme.gapSize}px;
  padding-bottom: ${({ theme }) => theme.gapSize}px;
`

const ImageLink = styled.a<{ area: string }>`
  grid-area: ${({ area }) => area};
  text-decoration: none;
`

const Image: React.FC<{
  src: string
  area: string
  height: OpaqueInterpolation<any>
  href?: string,
  size: number
}> = ({ src, area, href, height, size }) => {
  return <ImageLink href={href} area={area} target='_blank'>
    <animated.img
      src={`${src}?size=${size}`}
      style={{ height, width: size }}
      alt=''
    />
  </ImageLink>
}

const KillmailEntry: React.FC<{
  killmail: Killmail
}> = ({ killmail }) => {
  const theme = useContext(ThemeContext)
  const { characterId, corporationId, allianceId, shipTypeId, url, receivedAt, scaledValue } = killmail

  const [{ opacity, height, paddingBottom }, set] = useSpring(() => ({ opacity: 0, height: 0, paddingBottom: 0 }))

  const animationFrame = useCallback(() => {
    const age = differenceInMilliseconds(new Date(), receivedAt)
    let opacity = ageMultiplier(age, scaledValue)
    let height: number
    if (age < killmailFullyVisibleMs || opacity > 0.1) {
      height = theme.unit
    } else {
      height = 0
      opacity = 0
    }
    set({ opacity, height, paddingBottom: height / 8 })
  }, [set, receivedAt, scaledValue, theme.unit])

  useAnimationFrame(animationFrame)

  return <EntryContainer style={{ opacity, paddingBottom, gridAutoRows: height }}>
    {shipTypeId && <Image
      src={`https://images.evetech.net/types/${shipTypeId}/render`}
      area='ship'
      height={height}
      href={url}
      size={theme.unit}
    />}
    {characterId && <Image
      src={`https://images.evetech.net/characters/${characterId}/portrait`}
      area='character'
      height={height}
      href={`https://zkillboard.com/character/${characterId}/`}
      size={theme.unit}
    />}
    {corporationId && <Image
      src={`https://images.evetech.net/corporations/${corporationId}/logo`}
      area='corporation'
      height={height}
      href={`https://zkillboard.com/corporation/${corporationId}/`}
      size={theme.unit}
    />}
    {allianceId && <Image
      src={`https://images.evetech.net/alliances/${allianceId}/logo`}
      area='alliance'
      height={height}
      href={`https://zkillboard.com/alliance/${allianceId}/`}
      size={theme.unit}
    />}
  </EntryContainer>
}

const KillmailTicker: React.FC<{
  killmails: Killmail[]
}> = ({ killmails }) => {
  const entries = killmails.map(km => <KillmailEntry killmail={km} key={km.id} />)

  return <TickerContainer>
    {entries}
  </TickerContainer>
}

export default KillmailTicker
