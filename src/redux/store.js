import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";
import addressSlice from "./slices/addressSlice"
import messageSlice from "./slices/messageSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    address: addressSlice,
    message: messageSlice,
  },
});

export default store;