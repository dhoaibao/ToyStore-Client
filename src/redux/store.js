import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";
import addressSlice from "./slices/addressSlice"

const store = configureStore({
    reducer: {
      user: userSlice,
      cart: cartSlice,
      address: addressSlice,
    },
  });
  
  export default store;