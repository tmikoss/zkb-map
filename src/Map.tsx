import React, { useMemo, useRef, useLayoutEffect } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
import { CameraControls } from './CameraControls'
import glow from './glow.png'
import { Killmail } from './useKillmails'
import keyBy from 'lodash/keyBy'
import { Dictionary } from 'lodash'

const VERTEX_SHADER = `
attribute float size;
attribute vec3 flareColor;

varying vec3 vColor;

void main() {
  vColor = flareColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

const FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform sampler2D pointTexture;

  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(color * vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
  }
`

const tempObject = new THREE.Object3D()
const tempVector = new THREE.Vector3()
const tempColor = new THREE.Color('red')

const systemSize = 2
const levelOfDetail = 4

const colorMaxSec = new THREE.Color('#2A9FD6')
const colorMinSec = new THREE.Color('#E6E6E6')
const backgroundColor = '#060606'

const flareTexture = THREE.ImageUtils.loadTexture(glow)

const Stars: React.FC<{
  solarSystems: SolarSystem[]
}> = ({ solarSystems }) => {
  const meshRef = useRef<THREE.InstancedMesh>()

  const colorArray = useMemo(() => {
    const colorsBySecurity = solarSystems.flatMap(({ security }) => {
      return colorMinSec.clone().lerp(colorMaxSec, security).toArray()
    })

    return Float32Array.from(colorsBySecurity)
  }, [solarSystems])

  useLayoutEffect(() => {
    if (!meshRef.current) {
      return
    }

    for (let index = 0; index < solarSystems.length; index++) {
      const { x, y, z } = solarSystems[index]
      tempObject.position.set(x, y, z)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(index, tempObject.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  }, [solarSystems])

  return <instancedMesh ref={meshRef} args={[null as any, null as any, solarSystems.length]} >
    <sphereBufferGeometry attach="geometry" args={[systemSize, levelOfDetail, levelOfDetail]}>
      <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
    </sphereBufferGeometry>

    <meshLambertMaterial attach="material" vertexColors />
  </instancedMesh>
}

const Indicators: React.FC<{
  solarSystems: SolarSystem[]
  killmails: React.MutableRefObject<Killmail[]>
}> = ({ solarSystems, killmails }) => {
  const pointsRef = useRef<THREE.Points>()

  const uniforms = useMemo(() => ({
    color: { value: tempColor },
    pointTexture: { value: flareTexture }
  }), [])

  const solarSystemLookup = useMemo(() => keyBy(solarSystems, 'id'), [solarSystems])

  useFrame(() => {
    if (!killmails.current || !pointsRef.current) {
      return
    }

    const flares: Dictionary<number> = {}

    for (let index = 0; index < killmails.current.length; index++) {
      const { receivedAt, solarSystemId, totalValue } = killmails.current[index]

      const timeMultiplier = 100.1
      const valueMultiplier = 1.1

      const value = 1 * timeMultiplier * valueMultiplier

      flares[solarSystemId] = (flares[solarSystemId] || 0) + value
    }

    const systemsWithKills = Object.keys(flares)
    const count = systemsWithKills.length

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let index = 0; index < count; index++) {
      const solarSystemId = systemsWithKills[index]

      const { x, y, z } = solarSystemLookup[solarSystemId] || { x: 0, y: 0, z: 0 }
      tempVector.x = x
      tempVector.y = y
      tempVector.z = z
      tempVector.toArray(positions, index * 3)

      tempColor.toArray(colors, index * 3)

      scales[index] = flares[solarSystemId]
    }

    const geometry = pointsRef.current.geometry as THREE.BufferGeometry

    console.log(pointsRef.current.geometry)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('flareColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(scales, 1))

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.size.needsUpdate = true
  })

  return <points ref={pointsRef}>
    <bufferGeometry attach="geometry" />
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={VERTEX_SHADER}
      fragmentShader={FRAGMENT_SHADER}
      blending={THREE.AdditiveBlending}
      depthTest={false}
      transparent={true}
      attach='material'
    />
  </points>
}

const Map: React.FC<{
  solarSystems: SolarSystem[]
  killmails: React.MutableRefObject<Killmail[]>
}> = ({ solarSystems, killmails }) => {
  return <Canvas
    gl={{ antialias: false, alpha: false }}
    camera={{ position: [0, 0, 1_000], near: 1, far: 10_000 }}
    onCreated={({ gl }) => gl.setClearColor(backgroundColor)}>
    <Stars solarSystems={solarSystems} />
    <Indicators solarSystems={solarSystems} killmails={killmails} />
    <CameraControls />
    <ambientLight />
  </Canvas>
}

export default React.memo(Map)
