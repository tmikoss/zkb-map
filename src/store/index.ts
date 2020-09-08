import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { combineReducers } from 'redux'

import solarSystems from './solarSystems'
import killmails from './killmails'
import connection from './connection'

const rootReducer = combineReducers({ solarSystems, killmails, connection })

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false
  })
})

type AppDispatch = typeof store.dispatch
type AppState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export { fetchSolarSystems } from './solarSystems'
export { receiveKillmail, trimKillmailsBefore } from './killmails'
export { receivePing, checkConnection } from './connection'

export default store
