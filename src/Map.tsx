import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
import { CameraControls } from './CameraControls'

const tempObject = new THREE.Object3D()

const levelOfDetail = 10

const colorMaxSec = new THREE.Color('#0000FF')
const colorMinSec = new THREE.Color('#BFBFBF')

const Stars: React.FC<{
  solarSystems: SolarSystem[]
  scales: React.RefObject<Record<number, number>>
}> = ({ solarSystems, scales }) => {
  const meshRef = useRef<THREE.InstancedMesh>()
  const colorArray = useMemo(() => {
    const colorsBySecurity = solarSystems.flatMap(({ security }) => {
      return colorMinSec.clone().lerp(colorMaxSec, security).toArray()
    })

    return Float32Array.from(colorsBySecurity)
  }, [solarSystems])

  useFrame(_state => {
    if (!meshRef.current || !scales.current) {
      return
    }

    for (let index = 0; index < solarSystems.length; index++) {
      const { x, y, z, id } = solarSystems[index]
      tempObject.position.set(x, y, z)
      const scale = scales.current[id] || 1
      tempObject.scale.set(scale, scale, scale)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(index, tempObject.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[null as any, null as any, solarSystems.length]} >
    <sphereBufferGeometry attach="geometry" args={[2, levelOfDetail, levelOfDetail]}>
      <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
    </sphereBufferGeometry>
    <meshPhongMaterial attach="material" vertexColors />
  </instancedMesh>
}

const Map: React.FC<{
  solarSystems: SolarSystem[]
  scales: React.RefObject<Record<number, number>>
}> = ({ solarSystems, scales }) => {
  return <Canvas
    gl={{ antialias: false, alpha: false }}
    camera={{ position: [0, 0, 1_000], near: 1, far: 10_000 }}
    onCreated={({ gl }) => gl.setClearColor('pink')}>
    <Stars solarSystems={solarSystems} scales={scales} />
    <CameraControls />
    <ambientLight />
    <pointLight position={[0, 0, 0]} intensity={0.55} />
  </Canvas>
}

export default React.memo(Map)
