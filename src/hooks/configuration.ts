import create from 'zustand'

export enum CameraMode {
  full,
  follow
}

type State = {
  cameraMode: CameraMode,
  setCameraMode: (mode: CameraMode) => void
}

export const useConfiguration = create<State>(set => ({
  cameraMode: CameraMode.full,
  setCameraMode: (mode) => set({ cameraMode: mode })
}))
