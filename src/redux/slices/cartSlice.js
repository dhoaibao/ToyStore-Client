import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalItems: 0,
        cartDetails: [],
        loading: false,
        error: null,
    },
    reducers: {
        setCart: (state, action) => {
            state.totalItems = action.payload.cartDetails.length;
            state.cartDetails = action.payload.cartDetails;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCart, setLoading, setError } = cartSlice.actions;

export default cartSlice.reducer;