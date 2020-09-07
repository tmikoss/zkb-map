import React from 'react'
import { Killmail } from './useKillmails'
import styled, { keyframes } from 'styled-components'
import { theme } from './utils/theme'
import { MAX_KILLMAIL_AGE_SEC } from './utils/scaling'
import { stringifyPrice } from './utils/formatting'

const UNIT = 32

// 50%, because MAX_KILLMAIL_AGE_SEC is not a guaranteed removal
const fade = keyframes`
  0% { opacity: 0; }
  0.5% { opacity: 1; }
  10% { opacity: 0.9; }
  50% { opacity: 0; }
  100% { opacity: 0; }
`

const TickerContainer = styled.div`
  position: absolute;
  top: ${UNIT / 2}px;
  left: ${UNIT / 2}px;
  overflow: hidden;
  max-height: calc(100vh - ${UNIT}px);
`

const EntryContainer = styled.div`
  display: grid;
  grid-template-areas: "ship character corporation alliance"
                       "ship data      data        data";
  grid-template-columns: ${UNIT * 2}px ${UNIT}px ${UNIT}px 1fr;
  grid-template-rows: repeat(2, ${UNIT}px);
  grid-gap: ${UNIT / 8}px;
  animation: ${fade} ${MAX_KILLMAIL_AGE_SEC * 2}s linear;
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
  const { characterId, corporationId, allianceId, shipTypeId, totalValue, url } = killmail

  return <EntryContainer>
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
  killmails: Killmail[]
  solarSystems: Record<number, SolarSystem>
}> = ({ killmails, solarSystems }) => {
  const entries = killmails.map(km => {
    const { id, solarSystemId } = km
    const solarSystem = solarSystems[solarSystemId]

    return solarSystem ? <KillmailEntry killmail={km} solarSystem={solarSystem} key={id} /> : null
  })

  return <TickerContainer>
    {entries}
  </TickerContainer>
}

export default KillmailTicker
