import React, { useRef, useContext } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { effectiveMultiplier, useMinViewportSize } from './utils/scaling'
import { buildAttributes, setAttributes, positionToArray } from './utils/geometry'
import Points from './Points'
import { ThemeContext } from 'styled-components'

const Flares: React.FC<{
  solarSystems: Record<string, SolarSystem>
  killmails: React.MutableRefObject<Killmail[]>
}> = ({ solarSystems, killmails }) => {
  const pointsRef = useRef<THREE.Points>()

  const theme = useContext(ThemeContext)

  const minViewportSize = useMinViewportSize()

  useFrame(() => {
    if (!killmails.current || !pointsRef.current) {
      return
    }

    const count = killmails.current.length

    const now = new Date()
    const baseFlareSize = minViewportSize / 8
    const colorFlare = new THREE.Color(theme.flare)

    const { positions, colors, scales } = buildAttributes(count)

    for (let index = 0; index < killmails.current.length; index++) {
      const { receivedAt, solarSystemId, scaledValue } = killmails.current[index]

      const solarSystem = solarSystems[solarSystemId] || {}

      const age = differenceInMilliseconds(now, receivedAt)
      scales[index] = baseFlareSize * effectiveMultiplier(age, scaledValue)

      positionToArray(solarSystem, positions, index)

      colorFlare.toArray(colors, index * 3)
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales)
  })

  return <Points ref={pointsRef} />
}

export default Flares
