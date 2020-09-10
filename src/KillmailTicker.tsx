import React from 'react'
import styled from 'styled-components'
import { theme } from './utils/theme'
import { ageMultiplier } from './utils/scaling'
import { stringifyPrice } from './utils/formatting'
import values from 'lodash/values'
import sortBy from 'lodash/sortBy'
import compact from 'lodash/compact'
import { animated, useSpring } from 'react-spring'
import { useAnimationFrame } from './useAnimationFrame'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'

const UNIT = 32

const TickerContainer = styled.div`
  position: absolute;
  top: ${UNIT / 2}px;
  left: ${UNIT / 2}px;
  overflow: hidden;
  max-height: calc(100vh - ${UNIT}px);
`

const EntryContainer = styled(animated.div)`
  display: grid;
  grid-template-areas: "ship character corporation alliance"
                       "ship data      data        data";
  grid-template-columns: ${UNIT * 2}px ${UNIT}px ${UNIT}px 1fr;
  grid-template-rows: repeat(2, ${UNIT}px);
  grid-gap: ${UNIT / 8}px;
`

const Data = styled.div`
  grid-area: data;
  color: ${theme.text};
`

const ImageLink = styled.a<{ area: string }>`
  grid-area: ${({ area }) => area};
  text-decoration: none;
`

const Image: React.FC<{
  src: string
  area: string
  size: number
  href?: string
}> = ({ src, area, size, href }) => {
  return <ImageLink href={href} area={area} target='_blank'>
    <img
      src={`${src}?size=${size}`}
      style={{ height: size, width: size }}
      alt=''
    />
  </ImageLink>
}

const KillmailEntry: React.FC<{
  killmail: Killmail
  solarSystem: SolarSystem
}> = ({ killmail, solarSystem }) => {
  const { name } = solarSystem
  const { characterId, corporationId, allianceId, shipTypeId, totalValue, url, receivedAt } = killmail

  const [props, set] = useSpring(() => ({ opacity: 0 }))

  useAnimationFrame(() => {
    const age = differenceInMilliseconds(new Date(), receivedAt)
    const opacity = ageMultiplier(age)
    set({ opacity })
  })

  return <EntryContainer style={props}>
    {shipTypeId && <Image
      src={`https://images.evetech.net/types/${shipTypeId}/render`}
      area='ship'
      size={UNIT * 2}
      href={url}
    />}
    {characterId && <Image
      src={`https://images.evetech.net/characters/${characterId}/portrait`}
      area='character'
      size={UNIT}
      href={`https://zkillboard.com/character/${characterId}/`}
    />}
    {corporationId && <Image
      src={`https://images.evetech.net/corporations/${corporationId}/logo`}
      area='corporation'
      size={UNIT}
      href={`https://zkillboard.com/corporation/${corporationId}/`}
    />}
    {allianceId && <Image
      src={`https://images.evetech.net/alliances/${allianceId}/logo`}
      area='alliance'
      size={UNIT}
      href={`https://zkillboard.com/alliance/${allianceId}/`}
    />}

    <Data>
      {stringifyPrice(totalValue)} @ {name}
    </Data>
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
      return <KillmailEntry killmail={km} solarSystem={solarSystem} key={id} />
    } else {
      return null
    }
  })

  return <TickerContainer>
    {entries}
  </TickerContainer>
}

export default KillmailTicker
