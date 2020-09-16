import React, { useCallback, useContext, useEffect, memo, useRef } from 'react'
import styled from 'styled-components'
import { effectiveMultiplier, killmailFullyVisibleMs } from './utils/scaling'
import { animated, useSpring, OpaqueInterpolation } from 'react-spring'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { ThemeContext } from 'styled-components'
import * as THREE from 'three'
import { useKillmails } from './hooks'

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
const animationStepInstant = 50

const KillmailEntry: React.FC<{
  killmail: Killmail
}> = memo(({ killmail }) => {
  const { unit } = useContext(ThemeContext)
  const { id, characterId, corporationId, allianceId, shipTypeId, url, receivedAt, scaledValue } = killmail

  const [{ height, paddingBottom, opacity }, set] = useSpring(() => ({ opacity: 0, height: 0, paddingBottom: 0 }))

  const isFocused = useRef(false)
  const isActive = useRef(true)
  useEffect(() => useKillmails.subscribe(state => {
    isFocused.current = state.focused ? state.focused.id === id : false
  }))

  useEffect(() => {
    const animate = () => {
      const age = differenceInMilliseconds(new Date(), receivedAt)
      let opacity: number
      let height = unit
      let paddingBottom = unit / 8
      let duration = animationStepNormal

      if (age < killmailFullyVisibleMs) { // very new, fade in animation
        opacity = 1
        duration = animationStepFast
      } else {
        const multiplier = effectiveMultiplier(age, scaledValue)
        if (multiplier > 0.1) { // reasonably new, keep visible
          if (isFocused.current) { // is being hovered - keep max brightness
            opacity = 1
          } else { // slowly fade out as multiplier drops
            opacity = THREE.MathUtils.clamp(multiplier, 0, 1)
          }
        } else { // old, fade it out
          opacity = 0
          height = 0
          paddingBottom = 0
          duration = animationStepFast
        }
      }

      isActive.current = opacity > 0

      set({ opacity, height, paddingBottom, config: { duration } })
    }

    const interval = setInterval(animate, animationStepNormal)
    animate()
    return () => clearInterval(interval)
  }, [set, receivedAt, scaledValue, unit])

  const focus = useKillmails(useCallback(state => state.focus, []))
  const unfocus = useKillmails(useCallback(state => state.unfocus, []))

  const onMouseEnter = useCallback(() => {
    set({ opacity: 1, config: { duration: animationStepInstant } })

    if (isActive.current) {
      focus(id)
    }
  }, [focus, id, set])
  const onMouseLeave = useCallback(() => unfocus(id), [unfocus, id])

  return <EntryContainer style={{ opacity, paddingBottom, gridAutoRows: height }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
