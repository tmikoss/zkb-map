import * as THREE from 'three'
import { useThree } from 'react-three-fiber'
import { normalKillmailAgeMs } from '../hooks/killmails'

export const killmailFullyVisibleMs = 500

export const ageMultiplier = (age: number, scale: number): number => {
  if (age < killmailFullyVisibleMs) {
    return THREE.MathUtils.smoothstep(age, 0, killmailFullyVisibleMs)
  } else {
    const fullyInvisibleMs = normalKillmailAgeMs * scale
    const t = THREE.MathUtils.smoothstep(age, killmailFullyVisibleMs, fullyInvisibleMs) - 1
    return Math.pow(t, 4)
  }
}

export const effectiveMultiplier = (age: number, scale: number): number => {
  return scale * ageMultiplier(age, scale)
}

const minValueBound = 10_000
const maxValueBound = 10_000_000_000
const minValueMultiplier = 1
const maxValueMultiplier = 10

export const scaleValue = (value: number): number => {
  const normalized = THREE.MathUtils.clamp(value, minValueBound, maxValueBound)
  return THREE.MathUtils.mapLinear(normalized, minValueBound, maxValueBound, minValueMultiplier, maxValueMultiplier)
}

export const useMinViewportSize = () => {
  const { size: { height, width } } = useThree()

  const minSize = Math.min(height, width)

  return minSize
}
