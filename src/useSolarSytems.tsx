import { useEffect, useState } from 'react'

export interface SolarSystem {
  id: number
  name: string
  x: number
  y: number
  z: number
  radius: number
  security: number
}

interface RawSolarSystem {
  x: number
  y: number
  z: number
  r: number
  s: number
  n: string
}

export function useSolarSystems(): SolarSystem[] {
  const [solarSystems, setSolarSystems] = useState<SolarSystem[]>([])

  useEffect(() => {
    fetch('data/solarSystems.json').then(res => res.json()).then((data: Record<string, RawSolarSystem>) => {
      const solarSystems = Object.entries(data).map(([id, { x, y, z, r, s, n }]) => {
        return {
          id: parseInt(id),
          x,
          y,
          z,
          name: n,
          radius: r,
          security: s
        } as SolarSystem
      })

      setSolarSystems(solarSystems)
    })
  }, [])

  return solarSystems
}
