import create from 'zustand'
import { combine } from 'zustand/middleware'

export enum CameraMode {
  full,
  follow
}

interface State {
  cameraMode: CameraMode
}

export const useConfiguration = create(
  combine(
    {
      cameraMode: CameraMode.full
    },
    set => ({
      update: (payload: Partial<State>) => set(state => ({ ...state, ...payload }))
    })
  )
)
