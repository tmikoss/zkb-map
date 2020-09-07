import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import keyBy from 'lodash/keyBy'

const slice = createSlice({
  name: 'solarSystems',
  initialState: {} as Record<string, SolarSystem>,
  reducers: {
    solarSystemsLoaded(_state, action: PayloadAction<SolarSystem[]>) {
      return keyBy(action.payload, 'id')
    }
  }
})

export const { solarSystemsLoaded } = slice.actions

export default slice.reducer
