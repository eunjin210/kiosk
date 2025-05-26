import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import modeReducer from './modeSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    mode: modeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
