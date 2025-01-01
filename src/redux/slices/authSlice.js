import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
    },
})

export const { setAuth } = authSlice.actions

export default authSlice.reducer