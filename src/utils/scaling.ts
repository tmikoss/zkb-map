import * as THREE from 'three'
import { useThree } from 'react-three-fiber'

export const MAX_KILLMAIL_AGE_SEC = 60

const fullyVisibleMs = 500
const fullyInvisibleMs = MAX_KILLMAIL_AGE_SEC * 1000

export const ageMultiplier = (age: number): number => {
  if (age < fullyVisibleMs) {
    return THREE.MathUtils.smoothstep(age, 0, fullyVisibleMs)
  } else {
    const t = THREE.MathUtils.smoothstep(age, fullyVisibleMs, fullyInvisibleMs) - 1
    return Math.pow(t, 4)
  }
}

const minValueBound = 10_000
const maxValueBound = 100_000_000_000
const minValueMultiplier = 0.5
const maxValueMultiplier = 15

export const scaleValue = (value: number): number => {
  const normalized = THREE.MathUtils.clamp(value, minValueBound, maxValueBound)
  return THREE.MathUtils.mapLinear(normalized, minValueBound, maxValueBound, minValueMultiplier, maxValueMultiplier)
}

export const useMinViewportSize = () => {
  const { size: { height, width } } = useThree()

  const minSize = Math.min(height, width)

  return minSize
}
