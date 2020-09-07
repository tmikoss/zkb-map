import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { combineReducers } from 'redux'

import solarSystems from './solarSystems'
export { fetchSolarSystems } from './solarSystems'

const rootReducer = combineReducers({ solarSystems })

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export default store
