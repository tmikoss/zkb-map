import create from 'zustand'

export enum CameraMode {
  full,
  follow
}

type State = {
  cameraMode: CameraMode,
  extendedTicker: boolean,
  setCameraMode: (mode: CameraMode) => void,
  toggleExtendedTicker: () => void
}

export const useConfiguration = create<State>(set => ({
  cameraMode: CameraMode.full,
  extendedTicker: true,
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleExtendedTicker: () => set(state => ({ extendedTicker: !state.extendedTicker }))
}))
