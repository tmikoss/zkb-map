import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import { useCallback, useEffect } from 'react'
import create from 'zustand'

const normalIntervalBetweenPingsMs = 15 * 1000
const checkInterval = 5 * 1000

type State = {
  connected: boolean,
  pingReceived?: Date,
  receivePing: () => void,
  checkConnection: () => void
}

export const useConnection = create<State>(set => ({
  connected: false,
  pingReceived: undefined,
  receivePing: () => set({ connected: true, pingReceived: new Date() }),
  checkConnection: () => set(({ pingReceived }) => {
    const connected = pingReceived ? differenceInMilliseconds(new Date(), pingReceived) < normalIntervalBetweenPingsMs : false
    return { connected }
  })
}))

export const useConnectionStatus = () => {
  const checkConnection = useConnection(useCallback(state => state.checkConnection, []))

  useEffect(() => {
    const interval = setInterval(checkConnection, checkInterval)
    return () => clearInterval(interval)
  }, [checkConnection])
}
