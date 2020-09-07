import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import pickBy from 'lodash/pickBy'

const slice = createSlice({
  name: 'killmails',
  initialState: {} as Record<string, Killmail>,
  reducers: {
    receiveKillmail: (state, action: PayloadAction<Killmail>) => {
      const killmail = action.payload
      state[killmail.id] = killmail
    },
    trimKillmailsBefore: (state, action: PayloadAction<Date>) => {
      return pickBy(state, killmail => killmail.receivedAt > action.payload)
    }
  }
})

export const { receiveKillmail, trimKillmailsBefore } = slice.actions
export default slice.reducer
