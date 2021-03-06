import React, { useCallback, useEffect, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei/PerspectiveCamera'
import * as THREE from 'three'
import { CameraMode } from './hooks/configuration'
import { positionToArray, HasPosition } from './utils/geometry'
import { useFrame } from 'react-three-fiber'
import { effectiveMultiplier } from './utils/scaling'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { useConfiguration } from './hooks'

const near = 0.001
const far = 100_000
const fov = 90

const defaultPosition = new THREE.Vector3(0, 0, 700)

const minRadius = defaultPosition.z / 3
const movementMultiplier = 0.01

const lookAtPoints = (points: HasPosition[]): THREE.Vector3 => {
  const count = points.length

  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index++) {
    positionToArray(points[index], positions, index)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  geometry.computeBoundingSphere()
  if (geometry.boundingSphere) {
    const { center, radius } = geometry.boundingSphere

    center.z += Math.max(radius, minRadius)
    return center
  } else {
    return defaultPosition
  }
}

const Camera: React.FC<{
  solarSystems: Record<string, SolarSystem>,
  killmails: React.MutableRefObject<Killmail[]>
}> = React.memo(({ solarSystems, killmails }) => {
  const mode = useConfiguration(useCallback(state => state.cameraMode, []))
  const ref = useRef<THREE.PerspectiveCamera>()
  const position = useRef(defaultPosition)

  useEffect(() => {
    const solarSystemArray = Object.values(solarSystems)
    if (solarSystemArray.length > 0) {
      position.current = lookAtPoints(solarSystemArray)
      if (ref.current) {
        ref.current.position.lerp(position.current, 1)
      }
    }
  }, [solarSystems])

  useFrame(() => {
    if (ref.current && position.current) {
      let target: THREE.Vector3

      const count = killmails.current?.length || 0

      if (count > 0 && mode === CameraMode.follow) {
        const now = new Date()

        let maxX = -Infinity
        let maxY = -Infinity
        let maxZ = -Infinity

        let minX = +Infinity
        let minY = +Infinity
        let minZ = +Infinity

        let totalX = 0
        let totalY = 0
        let totalZ = 0

        let totalScale = 0

        for (let index = 0; index < count; index++) {
          const { solarSystemId, scaledValue, receivedAt } = killmails.current[index]
          const { x, y, z } = solarSystems[solarSystemId]

          const age = differenceInMilliseconds(now, receivedAt)
          const scale = effectiveMultiplier(age, scaledValue)

          if (scale > 0.1) {
            const scaledX = scale * x
            const scaledY = scale * y
            const scaledZ = scale * z

            maxX = Math.max(maxX, x)
            maxY = Math.max(maxY, y)
            maxZ = Math.max(maxZ, z)

            minX = Math.min(minX, x)
            minY = Math.min(minY, y)
            minZ = Math.min(minZ, z)

            totalX += scaledX
            totalY += scaledY
            totalZ += scaledZ

            totalScale += scale
          }
        }

        if (totalScale > 0) {
          const x = totalX / totalScale
          const y = totalY / totalScale
          const z = totalZ / totalScale

          const radius = Math.max(
            maxX - x,
            maxY - y,
            maxZ - z,
            x - minX,
            y - minY,
            z - minZ,
            minRadius
          )

          target = new THREE.Vector3(x, y, z + radius * 1.1)
        } else {
          target = position.current.clone()
        }
      } else {
        target = position.current.clone()
      }

      if (ref.current.aspect < 1) {
        // for taller-than-wider screens, the default fitment doesn't work. so we "zoom out" by scaling along z axis
        target.multiply(new THREE.Vector3(1, 1, 1 / ref.current.aspect))
      }

      ref.current.position.lerp(target, movementMultiplier)
    }
  })

  return <>
    <PerspectiveCamera
      ref={ref}
      makeDefault
      near={near}
      far={far}
      fov={fov}
    />
  </>
})

export default Camera
