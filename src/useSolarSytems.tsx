import { useEffect, useState } from 'react'
import { useAppDispatch } from './store'
import { solarSystemsLoaded } from './store/solarSystems'

interface RawSolarSystem {
  x: number
  y: number
  z: number
  r: number
  s: number
  n: string
}

export function useSolarSystems() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    fetch('data/solarSystems.json').then(res => res.json()).then((data: Record<string, RawSolarSystem>) => {
      const solarSystems = Object.entries(data).map(([id, { x, y, z, r, s, n }]) => {
        return {
          id: parseInt(id),
          x,
          y: z,
          z: y,
          name: n,
          radius: r,
          security: s
        } as SolarSystem
      })

      dispatch(solarSystemsLoaded(solarSystems))
    })
  }, [dispatch])
}
