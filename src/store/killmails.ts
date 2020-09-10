import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import pickBy from 'lodash/pickBy'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'

const shouldKeep = (killmail: Killmail, now: Date, normalAge: number) => {
  const { scaledValue, receivedAt } = killmail
  const age = differenceInMilliseconds(now, receivedAt)
  return age < normalAge * scaledValue
}

const slice = createSlice({
  name: 'killmails',
  initialState: {} as Record<string, Killmail>,
  reducers: {
    receiveKillmail: (state, action: PayloadAction<{ killmail: Killmail, normalAge: number }>) => {
      const { killmail, normalAge } = action.payload
      if (shouldKeep(killmail, new Date(), normalAge)) {
        state[killmail.id] = killmail
      }
    },
    trimKillmails: (state, action: PayloadAction<number>) => {
      const now = new Date()
      const normalAge = action.payload
      return pickBy(state, killmail => shouldKeep(killmail, now, normalAge))
    }
  }
})

export const { receiveKillmail, trimKillmails } = slice.actions
export default slice.reducer
