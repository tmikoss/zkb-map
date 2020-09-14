import create from 'zustand'

export enum CameraMode {
  full,
  follow
}

type State = {
  cameraMode: CameraMode,
  showRegionNames: boolean,
  setCameraMode: (mode: CameraMode) => void,
  toggleRegionNames: () => void
}

export const useConfiguration = create<State>(set => ({
  cameraMode: CameraMode.full,
  showRegionNames: false,
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleRegionNames: () => set(state => ({ showRegionNames: !state.showRegionNames }))
}))
