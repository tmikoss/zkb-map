import React, { useState } from 'react'
import { CameraControls } from './CameraControls'
import { PerspectiveCamera } from 'drei'
import * as THREE from 'three'

const near = 0.001
const far = 10_000
const fov = 90

const Camera: React.FC = () => {
  const [cameraPosition, _setCameraPosition] = useState(new THREE.Vector3(0, 0, 700))

  return <>
    <PerspectiveCamera
      makeDefault
      position={cameraPosition}
      near={near}
      far={far}
      fov={fov}
    />
    <CameraControls />
  </>
}

export default Camera
