import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import pickBy from 'lodash/pickBy'
import subSeconds from 'date-fns/subSeconds'

const slice = createSlice({
  name: 'killmails',
  initialState: {} as Record<string, Killmail>,
  reducers: {
    receiveKillmail: (state, action: PayloadAction<Killmail>) => {
      const killmail = action.payload
      state[killmail.id] = killmail
    },
    trimKillmailsBefore: (state, action: PayloadAction<number>) => {
      const oldest = subSeconds(new Date(), action.payload)
      return pickBy(state, killmail => killmail.receivedAt > oldest)
    }
  }
})

export const { receiveKillmail, trimKillmailsBefore } = slice.actions
export default slice.reducer
