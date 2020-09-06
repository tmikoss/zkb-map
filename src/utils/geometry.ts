import * as THREE from 'three'

export const buildAttributes = (count: number) => ({
  positions: new Float32Array(count * 3),
  colors: new Float32Array(count * 3),
  scales: new Float32Array(count)
})

export const setAttributes = (geometry: THREE.BufferGeometry, positions: Float32Array, colors: Float32Array, scales: Float32Array) => {
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('flareColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(scales, 1))

  geometry.attributes.position.needsUpdate = true
  geometry.attributes.flareColor.needsUpdate = true
  geometry.attributes.size.needsUpdate = true
}

interface HasPosition {
 x: number
 y: number
 z: number
}

const tempVector = new THREE.Vector3()
export const positionToArray = ({ x, y, z }: HasPosition, target: Float32Array, index: number): void => {
  tempVector.x = x
  tempVector.y = y
  tempVector.z = z
  tempVector.toArray(target, index * 3)
}

