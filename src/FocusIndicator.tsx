import React, { memo, useCallback, useContext, useEffect, useRef, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { useKillmails, useSolarSystems } from './hooks'
import * as THREE from 'three'
import { ThemeContext } from 'styled-components'
import { Text } from '@react-three/drei'
import { stringifyPrice } from './utils/formatting'

type TSThinksThisIsSvgLineTodoFix = any

interface TroikaTextObject {
  text: string
  position: THREE.Vector3
  anchorX: number | 'left' | 'center' | 'right'
  anchorY: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom'
  fontSize: number
  geometry: THREE.InstancedBufferGeometry
}

const FocusIndicator: React.FC = () => {
  const solarSystems = useSolarSystems(useCallback(state => state.systems, []))
  const focusedKillmail = useRef<Killmail>()
  const focusedSolarSystem = useRef<SolarSystem>()
  const theme = useContext(ThemeContext)
  const lineRef = useRef<THREE.Line<THREE.BufferGeometry>>(null)
  const valueTextRef = useRef<TroikaTextObject>(null)
  const locationTextRef = useRef<TroikaTextObject>(null)

  const { camera } = useThree()

  useEffect(() => useKillmails.subscribe(state => {
    focusedKillmail.current = state.focused
    focusedSolarSystem.current = state.focused ? solarSystems[state.focused.solarSystemId] : undefined
  }))

  const textMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: theme.text, depthTest: false })
  }, [theme.text])

  useFrame(() => {
    let positions = new Float32Array(0)
    let valueText = ''
    let locatioText = ''
    let textX = 0
    let textY = 0
    let textZ = 0
    let textAnchorX: TroikaTextObject['anchorX'] = 'left'
    let textSize = 0

    if (focusedKillmail.current && focusedSolarSystem.current ) {
      const { totalValue } = focusedKillmail.current
      const { x, y, z, name, regionName } = focusedSolarSystem.current
      const { x: cameraX, y: cameraY, z: cameraZ } = camera.position

      const cameraZOffset = cameraZ - z

      const lineOffset = cameraZOffset / 40

      const offsetX = x > cameraX ? -lineOffset : lineOffset
      const offsetY = y > cameraY ? -lineOffset : lineOffset

      const offsetZ = lineOffset / 10

      const xStart = x
      const yStart = y
      const zStart = z

      const xHorizontalStart = xStart + offsetX * 5
      const xHorizontalEnd = xHorizontalStart + offsetX * 5

      const yHorizontal = yStart + offsetY * 3
      const zHorizontal = zStart + offsetZ * 3

      locatioText = `${name}, ${regionName}`
      valueText = stringifyPrice(totalValue)

      textX = xHorizontalStart
      textY = yHorizontal
      textZ = zHorizontal
      textAnchorX = offsetX > 0 ? 'left' : 'right'
      textSize = cameraZOffset / 30

      positions = new Float32Array([
        xStart, yStart, zStart,
        xHorizontalStart, yHorizontal, zHorizontal,
        xHorizontalEnd, yHorizontal, zHorizontal
      ])
    }

    if (lineRef.current) {
      const { geometry } = lineRef.current

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.attributes.position.needsUpdate = true

      lineRef.current.material = textMaterial
    }

    if (valueTextRef.current && locationTextRef.current) {
      const valueTextObject = valueTextRef.current
      valueTextObject.text = valueText
      valueTextObject.position.set(textX, textY, textZ)
      valueTextObject.anchorX = textAnchorX
      valueTextObject.fontSize = textSize

      const locationTextObject = locationTextRef.current
      locationTextObject.text = locatioText
      locationTextObject.position.set(textX, textY, textZ)
      locationTextObject.anchorX = textAnchorX
      locationTextObject.fontSize = textSize * 0.75
    }
  })

  return <group>
    <line ref={lineRef as TSThinksThisIsSvgLineTodoFix}>
      <bufferGeometry attach='geometry' />
    </line>
    <Text ref={valueTextRef} material={textMaterial} fontSize={0} children='' anchorY='top' />
    <Text ref={locationTextRef} material={textMaterial} fontSize={0} children='' anchorY='bottom'/>
  </group>
}

export default memo(FocusIndicator)
