import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ageMultiplier, killmailFullyVisibleMs } from './utils/scaling'
import values from 'lodash/values'
import sortBy from 'lodash/sortBy'
import compact from 'lodash/compact'
import { animated, useSpring, OpaqueInterpolation } from 'react-spring'
import { useAnimationFrame } from './useAnimationFrame'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'

const UNIT = 32

const TickerContainer = styled.div`
  position: absolute;
  top: ${UNIT / 2}px;
  left: ${UNIT / 2}px;
  overflow: hidden;
  max-height: calc(100vh - ${UNIT}px);
  display: flex;
  flex-flow: column;
`

const EntryContainer = styled(animated.div)`
  display: grid;
  grid-template-areas: "ship character corporation alliance";
  grid-auto-columns: ${UNIT}px;
  grid-auto-rows: ${UNIT}px;
  gap: ${UNIT / 8}px;
  padding-bottom: ${UNIT / 8}px;
`

const ImageLink = styled.a<{ area: string }>`
  grid-area: ${({ area }) => area};
  text-decoration: none;
`

const Image: React.FC<{
  src: string
  area: string
  height: OpaqueInterpolation<any>
  href?: string
}> = ({ src, area, href, height }) => {
  return <ImageLink href={href} area={area} target='_blank'>
    <animated.img
      src={`${src}?size=${UNIT}`}
      style={{ height, width: UNIT }}
      alt=''
    />
  </ImageLink>
}

const KillmailEntry: React.FC<{
  killmail: Killmail
}> = ({ killmail }) => {
  const { characterId, corporationId, allianceId, shipTypeId, url, receivedAt, scaledValue } = killmail

  const [{ opacity, height, paddingBottom }, set] = useSpring(() => ({ opacity: 0, height: 0, paddingBottom: 0 }))

  const animationFrame = useCallback(() => {
    const age = differenceInMilliseconds(new Date(), receivedAt)
    let opacity = ageMultiplier(age, scaledValue)
    let height: number
    if (age < killmailFullyVisibleMs || opacity > 0.1) {
      height = UNIT
    } else {
      height = 0
      opacity = 0
    }
    set({ opacity, height, paddingBottom: height / 8 })
  }, [set])

  useAnimationFrame(animationFrame)

  return <EntryContainer style={{ opacity, paddingBottom, gridAutoRows: height }}>
    {shipTypeId && <Image
      src={`https://images.evetech.net/types/${shipTypeId}/render`}
      area='ship'
      height={height}
      href={url}
    />}
    {characterId && <Image
      src={`https://images.evetech.net/characters/${characterId}/portrait`}
      area='character'
      height={height}
      href={`https://zkillboard.com/character/${characterId}/`}
    />}
    {corporationId && <Image
      src={`https://images.evetech.net/corporations/${corporationId}/logo`}
      area='corporation'
      height={height}
      href={`https://zkillboard.com/corporation/${corporationId}/`}
    />}
    {allianceId && <Image
      src={`https://images.evetech.net/alliances/${allianceId}/logo`}
      area='alliance'
      height={height}
      href={`https://zkillboard.com/alliance/${allianceId}/`}
    />}
  </EntryContainer>
}

const KillmailTicker: React.FC<{
  killmails: Record<string, Killmail>
  solarSystems: Record<string, SolarSystem>
}> = ({ killmails, solarSystems }) => {
  const entries = compact(sortBy(values(killmails), 'receivedAt').reverse()).map(km => {
    const { id, solarSystemId } = km
    const solarSystem = solarSystems[solarSystemId]

    if (solarSystem) {
      return <KillmailEntry killmail={km} key={id} />
    } else {
      return null
    }
  })

  return <TickerContainer>
    {entries}
  </TickerContainer>
}

export default KillmailTicker
