import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { combineReducers } from 'redux'

import solarSystems from './solarSystems'
import killmails from './killmails'

const rootReducer = combineReducers({ solarSystems, killmails })

const store = configureStore({
  reducer: rootReducer
})

type AppDispatch = typeof store.dispatch
type AppState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export { fetchSolarSystems } from './solarSystems'
export { receiveKillmail, trimKillmailsBefore } from './killmails'

export default store
