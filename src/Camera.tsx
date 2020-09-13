import React, { useEffect, useRef } from 'react'
import { CameraControls } from './CameraControls'
import { PerspectiveCamera } from 'drei'
import * as THREE from 'three'
import { CameraMode } from './store/configuration'
import { positionToArray, HasPosition } from './utils/geometry'
import { useFrame } from 'react-three-fiber'
import map from 'lodash/map'

const near = 0.001
const far = 10_000
const fov = 90

const defaultPosition = new THREE.Vector3(0, 0, 700)
const defaultQuaternion = new THREE.Quaternion()

const minZ = defaultPosition.z / 3
const movementMultiplier = 0.02

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

    center.z += Math.max(radius * 1.1, minZ)
    return center
  } else {
    return defaultPosition
  }
}

const Camera: React.FC<{
  solarSystems: Record<string, SolarSystem>,
  killmails: React.MutableRefObject<Killmail[]>,
  mode: CameraMode
}> = ({ solarSystems, mode, killmails }) => {
  const ref = useRef<THREE.Camera>()
  const position = useRef(defaultPosition)

  useEffect(() => {
    const solarSystemArray = Object.values(solarSystems)
    if (solarSystemArray.length > 0) {
      position.current = lookAtPoints(solarSystemArray)
    }
  }, [solarSystems])

  useFrame(() => {
    if (ref.current && position.current && mode === CameraMode.follow) {
      let target = position.current

      if (killmails.current && killmails.current.length > 0) {
        target = lookAtPoints(map(killmails.current, km => solarSystems[km.solarSystemId]))
      }

      ref.current.position.lerp(target, movementMultiplier)
      ref.current.quaternion.slerp(defaultQuaternion, movementMultiplier)
    }
  })

  return <>
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={ref.current?.position || position.current}
      quaternion={ref.current?.quaternion || defaultQuaternion}
      near={near}
      far={far}
      fov={fov}
    />
    {mode === CameraMode.free && <CameraControls />}
  </>
}

export default Camera
