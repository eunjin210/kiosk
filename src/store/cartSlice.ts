import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@/type';

export type CartItem = Omit<MenuItem, 'price'> & {
  cartId: number;
  quantity: number;
  price: number;
  selectedTemp?: 'HOT' | 'COLD';
  selectedSize?: 'S' | 'L';
};

interface CartState {
  items: CartItem[];
  nextCartId: number;
}

const initialState: CartState = {
  items: [],
  nextCartId: 1,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, 'cartId'>>) {
      state.items.push({ ...action.payload, cartId: state.nextCartId++ });
    },
    updateQuantity(
      state,
      action: PayloadAction<{ cartId: number; quantity: number }>
    ) {
      const item = state.items.find((i) => i.cartId === action.payload.cartId);
      if (item) item.quantity = action.payload.quantity;
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.cartId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.nextCartId = 1;
    },
  },
});

export const { addItem, removeItem, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
