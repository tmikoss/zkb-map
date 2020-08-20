import React from 'react'
import { Killmail } from './useKillmails'
import styled from 'styled-components'

const UNIT = 64

const Container = styled.div`
  display: grid;
  grid-template-areas: "ship character corporation data"
                       "ship character alliance    data";
  grid-template-columns: repeat(2, ${UNIT * 2}px) ${UNIT}px 1fr;
  grid-template-rows: repeat(2, ${UNIT}px);
  grid-gap: ${UNIT / 8}px;
`

const Data = styled.pre`
  grid-area: data;
`

const Image: React.FC<{
  src: string
  area: string
  size: number
}> = ({ src, area, size }) => {
  return <img src={`${src}?size=${size}`} style={{ height: size, width: size, gridArea: area }} />
}

const KillmailEntry: React.FC<{
  killmail: Killmail
}> = ({ killmail }) => {
  const { characterId, corporationId, allianceId } = killmail

  return <Container>
    <Image src={`https://images.evetech.net/characters/${characterId}/portrait`} area='character' size={UNIT * 2} />
    <Image src={`https://images.evetech.net/corporations/${corporationId}/logo`} area='corporation' size={UNIT} />
    {allianceId && <Image src={`https://images.evetech.net/alliances/${allianceId}/logo`} area='alliance' size={UNIT} />}
    <Data>
      {JSON.stringify(killmail, null, 2)}
    </Data>
  </Container>
}

export default KillmailEntry
