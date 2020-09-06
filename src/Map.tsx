import React, { useMemo, useRef, useLayoutEffect, forwardRef } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
import { CameraControls } from './CameraControls'
import glow from './glow.png'
import { Killmail } from './useKillmails'
import keyBy from 'lodash/keyBy'
import { Dictionary } from 'lodash'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { ageMultiplier } from './calculations'
import { useTheme } from 'styled-components'

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

const flareTexture = THREE.ImageUtils.loadTexture(glow)

const uniforms = {
  color: { value: new THREE.Color() },
  pointTexture: { value: flareTexture }
}

const systemSize = 5
const baseFlareSize = 150
const maxFlareSize = 1000

const colorMaxSec = new THREE.Color('#2A9FD6')
const colorMinSec = new THREE.Color('#E6E6E6')
const colorFlare = new THREE.Color('#E60000')

const Points = forwardRef((_props, ref) => <points ref={ref as any}>
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
</points>)

const buildAttributes = (count: number) => ({
  positions: new Float32Array(count * 3),
  colors: new Float32Array(count * 3),
  scales: new Float32Array(count)
})

const setAttributes = (geometry: THREE.BufferGeometry, positions: Float32Array, colors: Float32Array, scales: Float32Array) => {
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('flareColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(scales, 1))

  geometry.attributes.position.needsUpdate = true
  geometry.attributes.flareColor.needsUpdate = true
  geometry.attributes.size.needsUpdate = true
}

const tempVector = new THREE.Vector3()
const vectorize = ({ x, y, z}: { x: number, y: number, z: number }) => {
  tempVector.x = x
  tempVector.y = y
  tempVector.z = z
  return tempVector
}

const Stars: React.FC<{
  solarSystems: SolarSystem[]
}> = ({ solarSystems }) => {
  const pointsRef = useRef<THREE.Points>()

  useLayoutEffect(() => {
    if (!pointsRef.current) {
      return
    }

    const count = solarSystems.length

    const { positions, colors, scales } = buildAttributes(count)

    for (let index = 0; index < count; index++) {
      const solarSystem = solarSystems[index]

      vectorize(solarSystem).toArray(positions, index * 3)

      colorMinSec.clone().lerp(colorMaxSec, solarSystem.security).toArray(colors, index * 3)

      scales[index] = systemSize
    }

    setAttributes(pointsRef.current.geometry as THREE.BufferGeometry, positions, colors, scales)
  }, [solarSystems])

  return <Points ref={pointsRef} />
}

const Indicators: React.FC<{
  solarSystems: SolarSystem[]
  killmails: React.MutableRefObject<Killmail[]>
}> = ({ solarSystems, killmails }) => {
  const pointsRef = useRef<THREE.Points>()

  const solarSystemLookup = useMemo(() => keyBy(solarSystems, 'id'), [solarSystems])

  useFrame(() => {
    if (!killmails.current || !pointsRef.current) {
      return
    }

    const flares: Dictionary<number> = {}

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

    for (let index = 0; index < count; index++) {
      const solarSystemId = systemsWithKills[index]
      const solarSystem = solarSystemLookup[solarSystemId] || {}

      vectorize(solarSystem).toArray(positions, index * 3)

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
  const theme = useTheme()

  return <Canvas camera={{ position: [0, -1_000, 0], near: 0.001, far: 10_000 }} onCreated={({ gl }) => gl.setClearColor(theme.background)}>
    <Stars solarSystems={solarSystems} key={solarSystems.length} />
    <Indicators solarSystems={solarSystems} killmails={killmails} />
    <CameraControls />
    <ambientLight />
  </Canvas>
}

export default React.memo(Map)
