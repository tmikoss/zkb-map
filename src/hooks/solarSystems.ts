import create from 'zustand'
import { combine } from 'zustand/middleware'
import reduce from 'lodash/reduce'
import clamp from 'lodash/clamp'

interface RawSolarSystem {
  x: number
  y: number
  z: number
  r: number
  s: number
  n: string
  p: number
}

interface RawRegion {
  x: number
  y: number
  z: number
  n: string
}

type UniverseApiResponse = {
  systems: Record<string, RawSolarSystem>,
  regions: Record<string, RawRegion>
}

type State = {
  systems: Record<string, SolarSystem>,
  regions: Record<string, Region>,
  loaded: boolean,
  load: (url: string) => void
}

export const useSolarSystems = create<State>(set => ({
  systems: {},
  regions: {},
  loaded: false,
  load: async (url: string) => {
    const response = await fetch(url)
    const data: UniverseApiResponse = await response.json()

    const regions = reduce(data.regions, (state, region, id) => {
      const { x, y, z, n } = region
      state[id] = {
        id: parseInt(id),
        x,
        y: z,
        z: y,
        name: n
      }
      return state
    }, {} as Record<string, Region>)

    const systems = reduce(data.systems, (state, system, id) => {
      const { x, y, z, n, r, s, p } = system
      state[id] = {
        id: parseInt(id),
        x,
        y: z,
        z: y,
        name: n,
        radius: clamp(r * 100, 0.5, 1.5),
        security: s,
        regionId: p
      }
      return state
    }, {} as Record<string, SolarSystem>)

    set({ regions, systems, loaded: true })
  }
}))
