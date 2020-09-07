import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import each from 'lodash/each'

interface RawSolarSystem {
  x: number
  y: number
  z: number
  r: number
  s: number
  n: string
}

type SolarSystemApiResponse = Record<string, RawSolarSystem>

export const fetchSolarSystems = createAsyncThunk<SolarSystemApiResponse, void>(
  'solarSystems/fetch',
  async () => {
    const response = await fetch(process.env.PUBLIC_URL + '/data/solarSystems.json')
    const data: SolarSystemApiResponse = await response.json()
    return data
  }
)

const slice = createSlice({
  name: 'solarSystems',
  initialState: {} as Record<string, SolarSystem>,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSolarSystems.fulfilled, (state, action) => {
      const raw = action.payload
      each(raw, (rawSolarSystem, id) => {
        const { x, y, z, n, r, s } = rawSolarSystem
        state[id] = {
          id: parseInt(id),
          x,
          y: z,
          z: y,
          name: n,
          radius: r,
          security: s
        }
      })
    })
  }
})

export default slice.reducer
