import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";

const store = configureStore({
    reducer: {
      user: userSlice,
      cart: cartSlice,
    },
  });
  
  export default store;