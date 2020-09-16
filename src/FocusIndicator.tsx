import React, { memo, useCallback, useContext, useEffect, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { useKillmails, useSolarSystems } from './hooks'
import * as THREE from 'three'
import { ThemeContext } from 'styled-components'
import { Text } from 'drei'
import { stringifyPrice } from './utils/formatting'

type TSThinksThisIsSvgLineTodoFix = any


interface TroikaTextObject {
  text: string
  position: THREE.Vector3
  anchorX: number | 'left' | 'center' | 'right'
  anchorY: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom'
  fontSize: number
}

const FocusIndicator: React.FC = () => {
  const solarSystems = useSolarSystems(useCallback(state => state.systems, []))
  const focusedKillmail = useRef<Killmail>()
  const focusedSolarSystem = useRef<SolarSystem>()
  const theme = useContext(ThemeContext)
  const lineRef = useRef<THREE.Line<THREE.BufferGeometry>>(null)
  const textRef = useRef<TroikaTextObject>(null)

  const { camera } = useThree()

  useEffect(() => useKillmails.subscribe(state => {
    focusedKillmail.current = state.focused
    focusedSolarSystem.current = state.focused ? solarSystems[state.focused.solarSystemId] : undefined
  }))

  useFrame(() => {
    let positions = new Float32Array(0)
    let text = ''
    let textX = 0
    let textY = 0
    let textZ = 0
    let textAnchorX: TroikaTextObject['anchorX'] = 'left'
    let textAnchorY: TroikaTextObject['anchorY'] = 'top'
    let textSize = 0

    if (focusedKillmail.current && focusedSolarSystem.current ) {
      const { totalValue } = focusedKillmail.current
      const { x, y, z, name } = focusedSolarSystem.current
      const { x: cameraX, y: cameraY, z: cameraZ } = camera.position

      const cameraZOffset = cameraZ - z

      const lineOffset = cameraZOffset / 40

      const offsetX = x > cameraX ? -lineOffset : lineOffset
      const offsetY = y > cameraY ? -lineOffset : lineOffset

      const offsetZ = lineOffset / 10

      const xStart = x + offsetX
      const yStart = y + offsetY
      const zStart = z + offsetZ

      const xHorizontalStart = xStart + offsetX * 5
      const xHorizontalEnd = xHorizontalStart + offsetX * 5

      const yHorizontal = yStart + offsetY * 3
      const zHorizontal = zStart + offsetZ * 3

      text = `${stringifyPrice(totalValue)} ${name}`
      textX = xHorizontalStart
      textY = yHorizontal
      textZ = zHorizontal
      textAnchorX = offsetX > 0 ? 'left' : 'right'
      textAnchorY = offsetY > 0 ? 'bottom' : 'top'
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
    }

    if (textRef.current) {
      const textObject = textRef.current
      textObject.text = text
      textObject.position.set(textX, textY, textZ)
      textObject.anchorX = textAnchorX
      textObject.anchorY = textAnchorY
      textObject.fontSize = textSize
    }
  })

  return <group>
    <line ref={lineRef as TSThinksThisIsSvgLineTodoFix}>
      <bufferGeometry attach='geometry' />
      <meshBasicMaterial attach='material' color={theme.text} />
    </line>
    <Text ref={textRef} color={theme.text} fontSize={0} children='' />
  </group>
}

export default memo(FocusIndicator)
