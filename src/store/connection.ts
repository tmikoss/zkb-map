import { createSlice } from '@reduxjs/toolkit'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'

const normalIntervalBetweenPingsMs = 15 * 1000

interface State {
  connected: boolean
  pingReceived?: Date
}

const initialState: State = {
  connected: false,
  pingReceived: undefined
}

const slice = createSlice({
  name: 'connection',
  initialState: initialState,
  reducers: {
    receivePing: (state) => {
      state.connected = true
      state.pingReceived = new Date()
    },
    checkConnection: (state) => {
      state.connected = state.pingReceived ? differenceInMilliseconds(new Date(), state.pingReceived) < normalIntervalBetweenPingsMs : false
    }
  }
})

export const { receivePing, checkConnection } = slice.actions
export default slice.reducer
