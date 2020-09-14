import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { combineReducers } from 'redux'

import killmails from './killmails'

const rootReducer = combineReducers({ killmails })

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false
  })
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export { receiveKillmail, trimKillmails } from './killmails'
export { useConfiguration } from './configuration'
export { useSolarSystems } from './solarSystems'
export { useConnection, useConnectionStatus } from './connection'

export default store
