import React, { useRef, useContext } from 'react'
import * as THREE from 'three'
import { buildAttributes, setAttributes, positionToArray } from './utils/geometry'
import Points from './Points'
import { ThemeContext } from 'styled-components'
import { useMinViewportSize } from './utils/scaling'
import { useFrame } from 'react-three-fiber'

const viewportRelativeScale = 75

const Stars: React.FC<{
  solarSystems: Record<string, SolarSystem>
}> = ({ solarSystems }) => {
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry>>(null)

  const theme = useContext(ThemeContext)

  const minViewportSize = useMinViewportSize()

  useFrame(() => {
    if (!pointsRef.current) {
      return
    }

    const colorMaxSec = new THREE.Color(theme.colorMaxSec)
    const solarSystemArray = Object.values(solarSystems)

    const count = solarSystemArray.length

    const systemSize = minViewportSize / viewportRelativeScale

    const { positions, colors, scales } = buildAttributes(count)

    for (let index = 0; index < count; index++) {
      const solarSystem = solarSystemArray[index]

      positionToArray(solarSystem, positions, index)

      new THREE.Color(theme.colorMinSec).lerp(colorMaxSec, solarSystem.security).toArray(colors, index * 3)

      scales[index] = systemSize * solarSystem.radius
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales)
  })

  return <Points ref={pointsRef} />
}

export default Stars
