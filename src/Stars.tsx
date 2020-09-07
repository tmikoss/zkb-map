import React, { useRef, useLayoutEffect, useContext } from 'react'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
import { buildAttributes, setAttributes, positionToArray } from './utils/geometry'
import Points from './Points'
import { ThemeContext } from './utils/theme'
import { useMinViewportSize } from './utils/scaling'

const viewportRelativeScale = 90

const Stars: React.FC<{
  solarSystems: SolarSystem[]
}> = ({ solarSystems }) => {
  const pointsRef = useRef<THREE.Points>()

  const theme = useContext(ThemeContext)

  const minViewportSize = useMinViewportSize()

  useLayoutEffect(() => {
    if (!pointsRef.current) {
      return
    }

    const colorMaxSec = new THREE.Color(theme.colorMaxSec)

    const count = solarSystems.length

    const systemSize = minViewportSize / viewportRelativeScale

    const { positions, colors, scales } = buildAttributes(count)

    for (let index = 0; index < count; index++) {
      const solarSystem = solarSystems[index]

      positionToArray(solarSystem, positions, index)

      new THREE.Color(theme.colorMinSec).lerp(colorMaxSec, solarSystem.security).toArray(colors, index * 3)

      scales[index] = systemSize
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales)
  }, [solarSystems, solarSystems.length, theme, minViewportSize])

  return <Points ref={pointsRef} />
}

export default React.memo(Stars)
