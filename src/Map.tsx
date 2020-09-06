import React, { useMemo, useRef, useLayoutEffect, useContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
import { Killmail } from './useKillmails'
import keyBy from 'lodash/keyBy'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { ageMultiplier } from './utils/scaling'
import { buildAttributes, setAttributes, positionToArray } from './utils/geometry'
import Points from './Points'
import { ThemeContext } from './utils/theme'

const systemSize = 5
const baseFlareSize = 150
const maxFlareSize = 1000

const Stars: React.FC<{
  solarSystems: SolarSystem[]
}> = ({ solarSystems }) => {
  const pointsRef = useRef<THREE.Points>()

  const theme = useContext(ThemeContext)

  useLayoutEffect(() => {
    if (!pointsRef.current || !theme) {
      return
    }

    const colorMaxSec = new THREE.Color(theme.colorMaxSec)

    const count = solarSystems.length

    const { positions, colors, scales } = buildAttributes(count)

    for (let index = 0; index < count; index++) {
      const solarSystem = solarSystems[index]

      positionToArray(solarSystem, positions, index)

      new THREE.Color(theme.colorMinSec).lerp(colorMaxSec, solarSystem.security).toArray(colors, index * 3)

      scales[index] = systemSize
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales)
  }, [solarSystems, solarSystems.length, theme])

  return <Points ref={pointsRef} />
}

const Indicators: React.FC<{
  solarSystems: SolarSystem[]
  killmails: React.MutableRefObject<Killmail[]>
}> = ({ solarSystems, killmails }) => {
  const pointsRef = useRef<THREE.Points>()

  const theme = useContext(ThemeContext)

  const solarSystemLookup = useMemo(() => keyBy(solarSystems, 'id'), [solarSystems])

  useFrame(() => {
    if (!killmails.current || !pointsRef.current) {
      return
    }

    const flares: Record<string, number> = {}

    const now = new Date()

    for (let index = 0; index < killmails.current.length; index++) {
      const { receivedAt, solarSystemId, scaledValue } = killmails.current[index]

      const age = differenceInMilliseconds(now, receivedAt)
      const value = baseFlareSize * scaledValue * ageMultiplier(age)

      flares[solarSystemId] = THREE.MathUtils.clamp((flares[solarSystemId] || 0) + value, 0, maxFlareSize)
    }

    const systemsWithKills = Object.keys(flares)
    const count = systemsWithKills.length

    const { positions, colors, scales } = buildAttributes(count)

    const colorFlare = new THREE.Color(theme.flare)

    for (let index = 0; index < count; index++) {
      const solarSystemId = systemsWithKills[index]
      const solarSystem = solarSystemLookup[solarSystemId] || {}

      positionToArray(solarSystem, positions, index)

      colorFlare.toArray(colors, index * 3)
      scales[index] = flares[solarSystemId]
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales)
  })

  return <Points ref={pointsRef} />
}

const Map: React.FC<{
  solarSystems: SolarSystem[]
  killmails: React.MutableRefObject<Killmail[]>
}> = ({ solarSystems, killmails }) => {

  return <>
    <Stars solarSystems={solarSystems} />
    <Indicators solarSystems={solarSystems} killmails={killmails} />
  </>
}

export default React.memo(Map)
