import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { SolarSystem } from './useSolarSytems'
import * as THREE from 'three'
import { Killmail } from './useKillmails'

// const colors = new Array(1000).fill().map(() => niceColors[17][Math.floor(Math.random() * 5)])

// function Boxes() {
//   const [hovered, set] = useState()
//   const colorArray = useMemo(() => Float32Array.from(new Array(1000).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])

//   const ref = useRef()
//   const previous = useRef()
//   useEffect(() => void (previous.current = hovered), [hovered])

//   useFrame(state => {
//     const time = state.clock.getElapsedTime()
//     ref.current.rotation.x = Math.sin(time / 4)
//     ref.current.rotation.y = Math.sin(time / 2)
//     let i = 0
//     for (let x = 0; x < 10; x++)
//       for (let y = 0; y < 10; y++)
//         for (let z = 0; z < 10; z++) {
//           const id = i++
//           tempObject.position.set(5 - x, 5 - y, 5 - z)
//           tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
//           tempObject.rotation.z = tempObject.rotation.y * 2
//           if (hovered !== previous.current) {
//             tempColor.set(id === hovered ? 'white' : colors[id]).toArray(colorArray, id * 3)
//             ref.current.geometry.attributes.color.needsUpdate = true
//           }
//           const scale = id === hovered ? 2 : 1
//           tempObject.scale.set(scale, scale, scale)
//           tempObject.updateMatrix()
//           ref.current.setMatrixAt(id, tempObject.matrix)
//         }
//     ref.current.instanceMatrix.needsUpdate = true
//   })

//   return (
//     <instancedMesh ref={ref} args={[null, null, 1000]} onPointerMove={e => set(e.instanceId)} onPointerOut={e => set(undefined)}>
      // <boxBufferGeometry attach="geometry" args={[0.7, 0.7, 0.7]}>
      //   <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
      // </boxBufferGeometry>
      // <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
//     </instancedMesh>
//   )
// }

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

const Stars: React.FC<{
  solarSystems: SolarSystem[]
  scales: React.RefObject<Record<number, number>>
}> = ({ solarSystems, scales }) => {
  const ref = useRef<THREE.InstancedMesh>()
  const colorArray = useMemo(() => Float32Array.from(new Array(solarSystems.length).flatMap((_, i) => tempColor.set('white').toArray())), [solarSystems.length])

  useFrame(_state => {
    if (!ref.current || !scales.current) {
      return
    }

    for (let index = 0; index < solarSystems.length; index++) {
      const { x, y, z, id } = solarSystems[index]
      tempObject.position.set(x, y, z)
      const scale = scales.current[id] || 1
      tempObject.scale.set(scale, scale, scale)
      tempObject.updateMatrix()
      ref.current.setMatrixAt(index, tempObject.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={ref} args={[null as any, null as any, solarSystems.length]} >
    <sphereBufferGeometry attach="geometry" args={[2, 32, 32]}>
      <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
    </sphereBufferGeometry>
    <meshBasicMaterial attach="material" />
  </instancedMesh>
}

const Map: React.FC<{
  solarSystems: SolarSystem[]
  scales: React.RefObject<Record<number, number>>
}> = ({ solarSystems, scales }) => {
  return <Canvas
    gl={{ antialias: false, alpha: false }}
    camera={{ position: [0, 1000, 0], near: 1, far: 10_000 }}
    onCreated={({ gl }) => gl.setClearColor('pink')}>
    <Stars solarSystems={solarSystems} scales={scales} />
  </Canvas>
}

export default React.memo(Map)
