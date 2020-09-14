import create from 'zustand'
import reduce from 'lodash/reduce'
import clamp from 'lodash/clamp'
import { useEffect } from 'react'

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
  receive: (data: UniverseApiResponse) => void
}

export const useSolarSystems = create<State>(set => ({
  systems: {},
  regions: {},
  loaded: false,
  receive: (data: UniverseApiResponse) => {
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

const selectLoaded = (state: State) => state.loaded
const selectReceive = (state: State) => state.receive

export const useSolarSystemData = (sourceUrl: string): void => {
  const loaded = useSolarSystems(selectLoaded)
  const receive = useSolarSystems(selectReceive)

  useEffect(() => {
    if (!loaded) {
      const abortController = new AbortController()

      fetch(sourceUrl, { signal: abortController.signal }).then(res => res.json()).then(receive)

      return () => abortController.abort()
    }
  }, [sourceUrl, loaded, receive])
}
