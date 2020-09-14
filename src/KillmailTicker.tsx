import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { ageMultiplier, killmailFullyVisibleMs } from './utils/scaling'
import { animated, useSpring, OpaqueInterpolation } from 'react-spring'
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

const animationStepNormal = 1000
const animationStepFast = 250

const KillmailEntry: React.FC<{
  killmail: Killmail
}> = React.memo(({ killmail }) => {
  const { unit } = useContext(ThemeContext)
  const { characterId, corporationId, allianceId, shipTypeId, url, receivedAt, scaledValue } = killmail

  const [{ height, paddingBottom, opacity }, set] = useSpring(() => ({ opacity: 0, height: 0, paddingBottom: 0 }))

  useEffect(() => {
    const height = unit
    const paddingBottom = unit / 8
    const animate = () => {
      const age = differenceInMilliseconds(new Date(), receivedAt)
      if (age < killmailFullyVisibleMs) {
        set({ opacity: 1, height, paddingBottom, config: { duration: animationStepFast } })
      } else {
        const opacity = ageMultiplier(age, scaledValue)
        if (opacity > 0.1) {
          set({ opacity, height, paddingBottom, config: { duration: animationStepNormal } })
        } else {
          set({ opacity: 0, height: 0, paddingBottom: 0, config: { duration: animationStepFast } })
        }
      }
    }

    const interval = setInterval(animate, animationStepNormal)
    animate()
    return () => clearInterval(interval)
  }, [set, receivedAt, scaledValue, unit])

  return <EntryContainer style={{ opacity, paddingBottom, gridAutoRows: height }}>
    {shipTypeId && <Image
      src={`https://images.evetech.net/types/${shipTypeId}/render`}
      area='ship'
      height={height}
      href={url}
      size={unit}
    />}
    {characterId && <Image
      src={`https://images.evetech.net/characters/${characterId}/portrait`}
      area='character'
      height={height}
      href={`https://zkillboard.com/character/${characterId}/`}
      size={unit}
    />}
    {corporationId && <Image
      src={`https://images.evetech.net/corporations/${corporationId}/logo`}
      area='corporation'
      height={height}
      href={`https://zkillboard.com/corporation/${corporationId}/`}
      size={unit}
    />}
    {allianceId && <Image
      src={`https://images.evetech.net/alliances/${allianceId}/logo`}
      area='alliance'
      height={height}
      href={`https://zkillboard.com/alliance/${allianceId}/`}
      size={unit}
    />}
  </EntryContainer>
})

const KillmailTicker: React.FC<{
  killmails: Killmail[]
}> = ({ killmails }) => {
  const entries = killmails.map(km => <KillmailEntry killmail={km} key={km.id} />)

  return <TickerContainer>
    {entries}
  </TickerContainer>
}

export default KillmailTicker
