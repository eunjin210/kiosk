import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type ModeType = 'default' | 'simple';
const initialState = 'default' as ModeType;

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<ModeType>) {
      return action.payload;
    },
    toggleMode(state) {
      return state === 'default' ? 'simple' : 'default';
    },
  },
});

export const { setMode, toggleMode } = modeSlice.actions;
export default modeSlice.reducer;
