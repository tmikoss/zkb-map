import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum CameraMode {
  free,
  follow
}

interface State {
  cameraMode: CameraMode
}

const initialState: State = {
  cameraMode: CameraMode.follow
}

const slice = createSlice({
  name: 'configuration',
  initialState: initialState,
  reducers: {
    updateConfiguration: (state, action: PayloadAction<Partial<State>>) => {
      return { ...state, ...action.payload }
    }
  }
})

export const { updateConfiguration } = slice.actions
export default slice.reducer
