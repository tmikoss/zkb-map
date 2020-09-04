import clamp from 'lodash/clamp'

const MAX_KILLMAIL_AGE_SEC = 60
const MAX_AGE_MSEC = MAX_KILLMAIL_AGE_SEC * 1000
const DECAY_SPEED = 4

export const ageMultiplier = (age: number): number => {
  const remaining = MAX_AGE_MSEC - age
  return Math.pow(remaining / 10_000, DECAY_SPEED)
}

const MIN_VALUE = 1_000_000
const MAX_VALUE = 100_000_000_000

export const scaleValue = (value: number): number => {
  const clamped = clamp(value, MIN_VALUE, MAX_VALUE) / MIN_VALUE
  return Math.pow(clamped, 1/5)
}
