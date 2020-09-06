import React, { useRef, useContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
import { Killmail } from './useKillmails'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { ageMultiplier } from './utils/scaling'
import { buildAttributes, setAttributes, positionToArray } from './utils/geometry'
import Points from './Points'
import { ThemeContext } from './utils/theme'

const baseFlareSize = 150
const maxFlareSize = 1000

const Flares: React.FC<{
  solarSystems: Record<string, SolarSystem>
  killmails: React.MutableRefObject<Killmail[]>
}> = ({ solarSystems, killmails }) => {
  const pointsRef = useRef<THREE.Points>()

  const theme = useContext(ThemeContext)

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
      const solarSystem = solarSystems[solarSystemId] || {}

      positionToArray(solarSystem, positions, index)

      colorFlare.toArray(colors, index * 3)
      scales[index] = flares[solarSystemId]
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales)
  })

  return <Points ref={pointsRef} />
}

export default React.memo(Flares)
